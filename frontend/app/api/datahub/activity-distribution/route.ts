import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const result = await pool.query(`
      SELECT 
        activity_type,
        COUNT(*) as count
      FROM survey_results
      WHERE activity_type IS NOT NULL AND activity_type != ''
      GROUP BY activity_type
      ORDER BY count DESC
    `)
    
    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0)
    
    const distribution = result.rows.map((row) => ({
      activity_type: row.activity_type,
      count: parseInt(row.count),
      percentage: total > 0 ? parseFloat(((parseInt(row.count) / total) * 100).toFixed(1)) : 0,
    }))
    
    await pool.end()
    
    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching activity distribution:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity distribution' },
      { status: 500 }
    )
  }
}
