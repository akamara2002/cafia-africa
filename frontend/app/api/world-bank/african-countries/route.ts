import { NextResponse } from 'next/server'
import { getAfricanCountriesData, AFRICAN_COUNTRY_CODES, type CountryFinancialData } from '@/lib/world-bank-api'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
export const maxDuration = 20

let lastSuccessfulPayload: {
  countries: CountryFinancialData[]
  timestamp: number
} | null = null

const FRESH_TTL_MS = 60 * 60 * 1000
const STALE_TTL_MS = 24 * 60 * 60 * 1000
const LIVE_FETCH_TIMEOUT_MS = 12000

function buildSafeFallback(): CountryFinancialData[] {
  const year = new Date().getFullYear()
  return AFRICAN_COUNTRY_CODES.map((code) => ({
    countryCode: code,
    countryName: code,
    year,
  }))
}

export async function GET() {
  if (lastSuccessfulPayload && Date.now() - lastSuccessfulPayload.timestamp < FRESH_TTL_MS) {
    return NextResponse.json(
      {
        countries: lastSuccessfulPayload.countries,
        total: lastSuccessfulPayload.countries.length,
        lastUpdated: new Date(lastSuccessfulPayload.timestamp).toISOString(),
        source: 'memory-cache',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  }

  try {
    const data = await Promise.race([
      getAfricanCountriesData(AFRICAN_COUNTRY_CODES),
      new Promise<CountryFinancialData[]>((_, reject) =>
        setTimeout(() => reject(new Error('World Bank fetch timeout')), LIVE_FETCH_TIMEOUT_MS),
      ),
    ])
    
    // Sort by account ownership (descending) for better display
    const sortedData = data.sort((a, b) => {
      const aValue = a.accountOwnership || 0
      const bValue = b.accountOwnership || 0
      return bValue - aValue
    })
    
    if (sortedData.length > 0) {
      lastSuccessfulPayload = {
        countries: [...sortedData],
        timestamp: Date.now(),
      }
    }

    return NextResponse.json(
      {
        countries: sortedData,
        total: sortedData.length,
        lastUpdated: new Date().toISOString(),
        source: 'live',
        indicators: {
          accountAccess: ['accountOwnership'],
          connectivity: ['mobileCellular', 'internetUsers', 'fixedBroadband'],
          economic: ['gdpPerCapita', 'population', 'gdpGrowth'],
          financialSector: ['privateCreditByBanks', 'bankBranches', 'atmsPer100k']
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching African countries data:', error)
    if (lastSuccessfulPayload && Date.now() - lastSuccessfulPayload.timestamp < STALE_TTL_MS) {
      return NextResponse.json(
        {
          countries: lastSuccessfulPayload.countries,
          total: lastSuccessfulPayload.countries.length,
          lastUpdated: new Date(lastSuccessfulPayload.timestamp).toISOString(),
          source: 'stale-cache',
          warning: 'Serving cached data because live provider is temporarily unavailable.',
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        },
      )
    }

    const fallback = buildSafeFallback()
    return NextResponse.json(
      {
        countries: fallback,
        total: fallback.length,
        lastUpdated: new Date().toISOString(),
        source: 'safe-fallback',
        warning: 'Live provider unavailable, serving fallback country list.',
      },
      { status: 200 },
    )
  }
}
