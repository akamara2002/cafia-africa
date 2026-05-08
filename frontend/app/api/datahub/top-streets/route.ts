import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'
import { getStreetNormalizationSQL } from '@/lib/street-normalizer'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const pool = await getDbConnection()
    
    const normalizedSQL = getStreetNormalizationSQL('street_standardized')
    
    const result = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY ${normalizedSQL}
      ORDER BY count DESC
      LIMIT $1
    `, [limit])
    
    const streets = result.rows.map((row) => ({
      street_name: row.street_name,
      count: parseInt(row.count),
    }))
    
    await pool.end()
    
    return NextResponse.json(streets)
  } catch (error) {
    console.error('Error fetching top streets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top streets' },
      { status: 500 }
    )
  }
}
