import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const result = await pool.query(`
      SELECT 
        business_type as setup_type,
        activity_type,
        COUNT(*) as count
      FROM survey_results
      WHERE business_type IS NOT NULL AND business_type != ''
        AND activity_type IS NOT NULL AND activity_type != ''
      GROUP BY business_type, activity_type
      ORDER BY count DESC
    `)
    
    const treemapData = result.rows.map(row => ({
      setup_type: row.setup_type,
      activity_type: row.activity_type,
      count: parseInt(row.count),
    }))
    
    await pool.end()
    
    return NextResponse.json(treemapData)
  } catch (error) {
    console.error('Error fetching activity treemap:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity treemap data' },
      { status: 500 }
    )
  }
}
