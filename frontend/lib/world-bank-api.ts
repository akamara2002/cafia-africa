// World Bank API utility for fetching financial inclusion data
// API Documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation

export interface CountryFinancialData {
  countryCode: string
  countryName: string
  year: number
  
  // Digital Financial Services - Account Access (Global Findex)
  accountOwnership?: number // Account ownership at financial institution or mobile-money-service provider (% age 15+)
  
  // Digital Connectivity
  mobileCellular?: number // Mobile cellular subscriptions (per 100 people)
  internetUsers?: number // Individuals using the Internet (% of population)
  fixedBroadband?: number // Fixed broadband subscriptions (per 100 people)
  
  // Economic Indicators
  gdpPerCapita?: number // GDP per capita (current US$)
  population?: number // Population, total
  gdpGrowth?: number // GDP growth (annual %)
  
  // Financial Sector Development
  privateCreditByBanks?: number // Domestic credit to private sector by banks (% of GDP)
  bankBranches?: number // Commercial bank branches (per 100,000 adults)
  atmsPer100k?: number // Automated teller machines (ATMs) (per 100,000 adults)
}

// World Bank indicator codes for Digital Financial Services
// Using only essential indicators to reduce API calls and avoid timeouts
const INDICATORS = {
  // Digital Financial Services - Account Access (Global Findex)
  ACCOUNT_OWNERSHIP: "FX.OWN.TOTL.ZS", // Account ownership at financial institution or mobile-money-service provider (% age 15+)
  
  // Digital Connectivity (most important)
  MOBILE_CELLULAR: "IT.CEL.SETS.P2", // Mobile cellular subscriptions (per 100 people)
  INTERNET_USERS: "IT.NET.USER.ZS", // Individuals using the Internet (% of population)
  
  // Economic Indicators (most important)
  GDP_PER_CAPITA: "NY.GDP.PCAP.CD", // GDP per capita (current US$)
  POPULATION: "SP.POP.TOTL", // Population, total
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const inFlightRequests = new Map<string, Promise<any>>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour
const STALE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const REQUEST_TIMEOUT_MS = 8000
const MAX_RETRIES = 2
const COUNTRY_CONCURRENCY = 4
const aggregateCache = new Map<string, { data: CountryFinancialData[]; timestamp: number }>()

/**
 * Fetch data from World Bank API with caching, retry logic, and timeout
 */
async function fetchWithCache(url: string, retries = MAX_RETRIES): Promise<any> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  // Prevent duplicate simultaneous requests for the same URL
  const existingRequest = inFlightRequests.get(url)
  if (existingRequest) {
    return existingRequest
  }

  const requestPromise = (async () => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CAFIA-DataHub/1.0 (+https://cafia-africa.com)',
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        // Use stale cache on transient external API failures.
        if ((response.status === 403 || response.status === 429 || response.status >= 500) && cached) {
          if (Date.now() - cached.timestamp < STALE_CACHE_DURATION) {
            return cached.data
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      cache.set(url, { data, timestamp: Date.now() })
      return data
    } catch (error: any) {
      if (attempt === retries - 1) {
        return null
      }
      // Exponential backoff with jitter and a higher base to reduce bursts.
      const baseDelay = Math.pow(2, attempt) * 1200
      const jitter = Math.floor(Math.random() * 500)
      await new Promise(resolve => setTimeout(resolve, baseDelay + jitter))
    }
  }
  return null
  })()

  inFlightRequests.set(url, requestPromise)
  try {
    return await requestPromise
  } finally {
    inFlightRequests.delete(url)
  }
}

async function runWithConcurrency<T>(tasks: Array<() => Promise<T>>, concurrency: number): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const current = index++
      results[current] = await tasks[current]()
      // Small pacing pause prevents request spikes that can trigger 403s.
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()))
  return results
}

type IndicatorKey = keyof typeof INDICATORS

function toYear(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? "0"), 10)
  return Number.isFinite(parsed) ? parsed : 0
}

type IndicatorPoint = {
  country?: { id?: string; value?: string }
  date?: string
  value?: number | null
}

async function fetchIndicatorForCountries(
  countryCodes: string[],
  indicatorCode: string,
): Promise<IndicatorPoint[]> {
  if (countryCodes.length === 0) return []
  const tasks = countryCodes.map((countryCode) => async () => {
    const url =
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}` +
      `?format=json&mrv=8&per_page=80`
    const data = await fetchWithCache(url)
    if (!data || !Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
      return [] as IndicatorPoint[]
    }
    return data[1] as IndicatorPoint[]
  })

  const batchResults = await runWithConcurrency(tasks, COUNTRY_CONCURRENCY)
  return batchResults.flat()
}

function setIndicatorValue(target: CountryFinancialData, key: IndicatorKey, value: number) {
  switch (key) {
    case "ACCOUNT_OWNERSHIP":
      target.accountOwnership = value
      break
    case "MOBILE_CELLULAR":
      target.mobileCellular = value
      break
    case "INTERNET_USERS":
      target.internetUsers = value
      break
    case "GDP_PER_CAPITA":
      target.gdpPerCapita = value
      break
    case "POPULATION":
      target.population = value
      break
  }
}

/**
 * Fetch financial inclusion data for a specific country
 */
export async function getCountryFinancialData(countryCode: string): Promise<CountryFinancialData | null> {
  const result = await getAfricanCountriesData([countryCode])
  return result.length > 0 ? result[0] : null
}

/**
 * Fetch data for multiple African countries
 * Processes in smaller batches to avoid timeouts
 */
export async function getAfricanCountriesData(countryCodes: string[]): Promise<CountryFinancialData[]> {
  const aggregateKey = [...countryCodes].sort().join(",")
  const existingAggregate = aggregateCache.get(aggregateKey)

  // Build base result map once, then fill indicator values from bulk endpoints.
  const byCountry = new Map<string, CountryFinancialData>()
  countryCodes.forEach((code) => {
    byCountry.set(code, {
      countryCode: code,
      countryName: code,
      year: 0,
    })
  })

  const indicatorEntries = Object.entries(INDICATORS) as Array<[IndicatorKey, string]>
  let successfulIndicators = 0
  for (const [indicatorKey, indicatorCode] of indicatorEntries) {
    const points = await fetchIndicatorForCountries(countryCodes, indicatorCode)
    if (points.length === 0) continue
    successfulIndicators += 1

    // Keep only the most recent non-null datapoint per country for this indicator.
    const latestByCountry = new Map<string, IndicatorPoint>()
    for (const point of points) {
      const code = point.country?.id
      if (!code || !byCountry.has(code) || point.value == null) continue

      const current = latestByCountry.get(code)
      if (!current || toYear(point.date) > toYear(current.date)) {
        latestByCountry.set(code, point)
      }
    }

    latestByCountry.forEach((point, code) => {
      const country = byCountry.get(code)
      if (!country || point.value == null) return
      if (point.country?.value) country.countryName = point.country.value
      const year = toYear(point.date)
      if (year > country.year) country.year = year
      setIndicatorValue(country, indicatorKey, point.value)
    })

    // Small spacing between indicator groups to reduce pressure.
    await new Promise((resolve) => setTimeout(resolve, 80))
  }

  const fresh = [...byCountry.values()].filter((c) => c.year > 0)
  if (fresh.length > 0 && successfulIndicators > 0) {
    aggregateCache.set(aggregateKey, { data: fresh, timestamp: Date.now() })
    return fresh
  }

  if (existingAggregate && Date.now() - existingAggregate.timestamp < STALE_CACHE_DURATION) {
    console.log("[World Bank API] Returning stale aggregate country data")
    return existingAggregate.data
  }

  return []
}

// ISO 3166-1 alpha-2 country codes for African countries
export const AFRICAN_COUNTRY_CODES = [
  "DZ", // Algeria
  "AO", // Angola
  "BJ", // Benin
  "BW", // Botswana
  "BF", // Burkina Faso
  "BI", // Burundi
  "CM", // Cameroon
  "CV", // Cape Verde
  "CF", // Central African Republic
  "TD", // Chad
  "KM", // Comoros
  "CG", // Congo
  "CD", // Democratic Republic of Congo
  "CI", // Ivory Coast
  "DJ", // Djibouti
  "EG", // Egypt
  "GQ", // Equatorial Guinea
  "ER", // Eritrea
  "ET", // Ethiopia
  "GA", // Gabon
  "GM", // Gambia
  "GH", // Ghana
  "GN", // Guinea
  "GW", // Guinea-Bissau
  "KE", // Kenya
  "LS", // Lesotho
  "LR", // Liberia
  "LY", // Libya
  "MG", // Madagascar
  "MW", // Malawi
  "ML", // Mali
  "MR", // Mauritania
  "MU", // Mauritius
  "MA", // Morocco
  "MZ", // Mozambique
  "NA", // Namibia
  "NE", // Niger
  "NG", // Nigeria
  "RW", // Rwanda
  "ST", // Sao Tome and Principe
  "SN", // Senegal
  "SC", // Seychelles
  "SL", // Sierra Leone
  "SO", // Somalia
  "ZA", // South Africa
  "SS", // South Sudan
  "SD", // Sudan
  "SZ", // Eswatini
  "TZ", // Tanzania
  "TG", // Togo
  "TN", // Tunisia
  "UG", // Uganda
  "ZM", // Zambia
  "ZW", // Zimbabwe
]
