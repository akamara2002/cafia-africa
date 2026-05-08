import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const result = await pool.query(`
      SELECT 
        ROW_NUMBER() OVER () as id,
        lat,
        lon,
        business_type as setup_type,
        activity_type,
        COALESCE(owner_gender, 'Unknown') as gender,
        street_standardized as street_name
      FROM survey_results
      WHERE lat IS NOT NULL 
        AND lon IS NOT NULL
        AND lat != 0
        AND lon != 0
    `)
    
    const points = result.rows.map((row, index) => ({
      id: index + 1,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lon),
      setup_type: row.setup_type || 'Unknown',
      activity_type: row.activity_type || 'Unknown',
      gender: row.gender,
      street_name: row.street_name || 'Unknown',
    }))
    
    await pool.end()
    
    return NextResponse.json(points)
  } catch (error) {
    console.error('Error fetching map points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch map points' },
      { status: 500 }
    )
  }
}
