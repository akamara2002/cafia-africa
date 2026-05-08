import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'
import { getStreetNormalizationSQL } from '@/lib/street-normalizer'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    // Get total businesses
    const totalBusinessesResult = await pool.query('SELECT COUNT(*) as count FROM survey_results')
    const totalBusinesses = parseInt(totalBusinessesResult.rows[0].count)
    
    // Get total unique areas (normalized streets)
    const normalizedSQL = getStreetNormalizationSQL('street_standardized')
    const totalStreetsResult = await pool.query(`
      SELECT COUNT(DISTINCT ${normalizedSQL}) as count 
      FROM survey_results 
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
    `)
    const totalStreets = parseInt(totalStreetsResult.rows[0].count)
    
    // Get GPS coverage percentage
    const gpsCoverageResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE lat IS NOT NULL AND lon IS NOT NULL) as gps_count,
        COUNT(*) as total
      FROM survey_results
    `)
    const gpsCount = parseInt(gpsCoverageResult.rows[0].gps_count)
    const total = parseInt(gpsCoverageResult.rows[0].total)
    const gpsCoveragePct = total > 0 ? Math.round((gpsCount / total) * 100) : 0
    
    // Get distinct setup types count
    const setupTypesResult = await pool.query('SELECT COUNT(DISTINCT business_type) as count FROM survey_results WHERE business_type IS NOT NULL')
    const distinctSetupTypes = parseInt(setupTypesResult.rows[0].count)
    
    await pool.end()
    
    return NextResponse.json({
      total_businesses: totalBusinesses,
      total_streets: totalStreets,
      gps_coverage_pct: gpsCoveragePct,
      distinct_setup_types: distinctSetupTypes,
    })
  } catch (error) {
    console.error('Error fetching summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summary data' },
      { status: 500 }
    )
  }
}
