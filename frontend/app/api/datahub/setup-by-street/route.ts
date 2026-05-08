import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'
import { getStreetNormalizationSQL } from '@/lib/street-normalizer'

export async function GET(request: Request) {
  try {
    const pool = await getDbConnection()
    
    const normalizedSQL = getStreetNormalizationSQL('street_standardized')
    
    // Get ALL streets with setup breakdown in one query - no limit to show all 28 areas
    const breakdownResult = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        business_type as setup_type,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
        AND business_type IS NOT NULL AND business_type != ''
      GROUP BY ${normalizedSQL}, business_type
      ORDER BY ${normalizedSQL}, count DESC
    `)
    
    // Get all unique street names
    const allStreets = Array.from(new Set(breakdownResult.rows.map(row => row.street_name)))
    
    // Organize data for ALL streets
    const streetData: Record<string, Record<string, number>> = {}
    allStreets.forEach(street => {
      streetData[street] = {}
    })
    
    breakdownResult.rows.forEach(row => {
      if (!streetData[row.street_name]) {
        streetData[row.street_name] = {}
      }
      streetData[row.street_name][row.setup_type] = parseInt(row.count)
    })
    
    // Return ALL streets sorted by total count
    const result = allStreets
      .map(street => ({
        street_name: street,
        total: Object.values(streetData[street] || {}).reduce((a, b) => a + b, 0),
        breakdown: streetData[street] || {},
      }))
      .sort((a, b) => b.total - a.total) // Sort by total descending
    
    await pool.end()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching setup by street:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setup by street data' },
      { status: 500 }
    )
  }
}
