import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'
import { getStreetNormalizationSQL } from '@/lib/street-normalizer'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const normalizedSQL = getStreetNormalizationSQL('street_standardized')
    
    // Get all streets with counts (normalized)
    const streetsResult = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY ${normalizedSQL}
      ORDER BY count DESC
    `)
    
    // Get setup breakdown for each street (normalized)
    const setupBreakdownResult = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        business_type,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
        AND business_type IS NOT NULL AND business_type != ''
      GROUP BY ${normalizedSQL}, business_type
    `)
    
    // Get gender breakdown for each street (normalized)
    const genderBreakdownResult = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        COALESCE(owner_gender, 'Unknown') as gender,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY ${normalizedSQL}, COALESCE(owner_gender, 'Unknown')
    `)
    
    // Organize breakdowns by street
    const setupByStreet: Record<string, Record<string, number>> = {}
    setupBreakdownResult.rows.forEach((row) => {
      if (!setupByStreet[row.street_name]) {
        setupByStreet[row.street_name] = {}
      }
      setupByStreet[row.street_name][row.business_type] = parseInt(row.count)
    })
    
    const genderByStreet: Record<string, Record<string, number>> = {}
    genderBreakdownResult.rows.forEach((row) => {
      if (!genderByStreet[row.street_name]) {
        genderByStreet[row.street_name] = {}
      }
      genderByStreet[row.street_name][row.gender] = parseInt(row.count)
    })
    
    const streets = streetsResult.rows.map((row) => ({
      street_name: row.street_name,
      count: parseInt(row.count),
      setup_breakdown: setupByStreet[row.street_name] || {},
      gender_breakdown: genderByStreet[row.street_name] || {},
    }))
    
    await pool.end()
    
    return NextResponse.json(streets)
  } catch (error) {
    console.error('Error fetching all streets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch all streets' },
      { status: 500 }
    )
  }
}
