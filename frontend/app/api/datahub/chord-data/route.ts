import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const pool = await getDbConnection()
    
    // Get top streets
    const topStreetsResult = await pool.query(`
      SELECT 
        street_standardized as street_name,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY street_standardized
      ORDER BY count DESC
      LIMIT $1
    `, [limit])
    
    const topStreets = topStreetsResult.rows.map(row => row.street_name)
    
    // Get street × setup type relationships
    const result = await pool.query(`
      SELECT 
        street_standardized as street_name,
        business_type as setup_type,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized = ANY($1::text[])
        AND business_type IS NOT NULL AND business_type != ''
      GROUP BY street_standardized, business_type
      ORDER BY count DESC
    `, [topStreets])
    
    const chordData = result.rows.map(row => ({
      street_name: row.street_name,
      setup_type: row.setup_type,
      count: parseInt(row.count),
    }))
    
    await pool.end()
    
    return NextResponse.json(chordData)
  } catch (error) {
    console.error('Error fetching chord data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chord data' },
      { status: 500 }
    )
  }
}
