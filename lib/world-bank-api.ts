// World Bank API utility for fetching financial inclusion data
// API Documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation

export interface CountryFinancialData {
  countryCode: string
  countryName: string
  year: number
  accountOwnership?: number // % of population with account (15+)
  gdpPerCapita?: number // GDP per capita (current US$)
  population?: number // Total population
  mobileCellular?: number // Mobile cellular subscriptions per 100 people
  internetUsers?: number // Individuals using the Internet (% of population)
}

// World Bank indicator codes
const INDICATORS = {
  ACCOUNT_OWNERSHIP: "FX.OWN.TOTL.ZS", // Account ownership at financial institution or mobile-money-service provider (% age 15+)
  GDP_PER_CAPITA: "NY.GDP.PCAP.CD", // GDP per capita (current US$)
  POPULATION: "SP.POP.TOTL", // Population, total
  MOBILE_CELLULAR: "IT.CEL.SETS.P2", // Mobile cellular subscriptions (per 100 people)
  INTERNET_USERS: "IT.NET.USER.ZS", // Individuals using the Internet (% of population)
}

// Cache for API responses (expires after 1 hour)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

/**
 * Fetch data from World Bank API with caching
 */
async function fetchWithCache(url: string): Promise<any> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    cache.set(url, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error("[v0] Error fetching from World Bank API:", error)
    return null
  }
}

/**
 * Fetch financial inclusion data for a specific country
 */
export async function getCountryFinancialData(countryCode: string): Promise<CountryFinancialData | null> {
  try {
    // Fetch all indicators in parallel
    const indicators = Object.entries(INDICATORS).map(([key, indicatorCode]) =>
      fetchWithCache(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&date=2017:2023&per_page=10`,
      ).then((data) => ({ key, data })),
    )

    const results = await Promise.all(indicators)

    // Process the data
    const processedData: any = {
      countryCode,
      countryName: "",
      year: 0,
    }

    results.forEach(({ key, data }) => {
      if (!data || !Array.isArray(data) || data.length < 2) return

      const dataPoints = data[1]
      if (!Array.isArray(dataPoints) || dataPoints.length === 0) return

      // Get the most recent data point with a value
      const recentData = dataPoints.find((point: any) => point.value !== null)
      if (!recentData) return

      if (!processedData.countryName) {
        processedData.countryName = recentData.country.value
      }
      if (!processedData.year && recentData.date) {
        processedData.year = Number.parseInt(recentData.date)
      }

      // Map the data based on indicator
      switch (key) {
        case "ACCOUNT_OWNERSHIP":
          processedData.accountOwnership = recentData.value
          break
        case "GDP_PER_CAPITA":
          processedData.gdpPerCapita = recentData.value
          break
        case "POPULATION":
          processedData.population = recentData.value
          break
        case "MOBILE_CELLULAR":
          processedData.mobileCellular = recentData.value
          break
        case "INTERNET_USERS":
          processedData.internetUsers = recentData.value
          break
      }
    })

    return processedData as CountryFinancialData
  } catch (error) {
    console.error("[v0] Error processing country data:", error)
    return null
  }
}

/**
 * Fetch data for multiple African countries
 */
export async function getAfricanCountriesData(countryCodes: string[]): Promise<CountryFinancialData[]> {
  const promises = countryCodes.map((code) => getCountryFinancialData(code))
  const results = await Promise.all(promises)
  return results.filter((data): data is CountryFinancialData => data !== null)
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
