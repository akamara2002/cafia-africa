import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'
import { getStreetNormalizationSQL } from '@/lib/street-normalizer'

export async function GET(request: Request) {
  try {
    const pool = await getDbConnection()
    
    const normalizedSQL = getStreetNormalizationSQL('street_standardized')
    
    // Get ALL streets with gender breakdown in one query - no limit to show all 28 areas
    const genderResult = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        COALESCE(owner_gender, 'Unknown') as gender,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY ${normalizedSQL}, COALESCE(owner_gender, 'Unknown')
      ORDER BY ${normalizedSQL}, gender
    `)
    
    // Get all unique street names
    const allStreets = Array.from(new Set(genderResult.rows.map(row => row.street_name)))
    
    // Organize data for ALL streets
    const streetData: Record<string, { total: number; female: number; male: number; unknown: number }> = {}
    
    // Initialize all streets
    allStreets.forEach(street => {
      streetData[street] = { total: 0, female: 0, male: 0, unknown: 0 }
    })
    
    // Process all gender data
    genderResult.rows.forEach(row => {
      if (streetData[row.street_name]) {
        streetData[row.street_name].total += parseInt(row.count)
        if (row.gender === 'Female') {
          streetData[row.street_name].female += parseInt(row.count)
        } else if (row.gender === 'Male') {
          streetData[row.street_name].male += parseInt(row.count)
        } else {
          streetData[row.street_name].unknown += parseInt(row.count)
        }
      }
    })
    
    // Return ALL streets sorted by total count
    const result = Object.entries(streetData)
      .map(([street_name, data]) => ({
        street_name,
        total: data.total,
        female: data.female,
        male: data.male,
        female_pct: data.total > 0 ? (data.female / data.total) * 100 : 0,
        male_pct: data.total > 0 ? (data.male / data.total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total) // Sort by total descending
    
    await pool.end()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching gender by street:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gender by street data' },
      { status: 500 }
    )
  }
}
