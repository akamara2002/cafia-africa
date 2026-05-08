import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const result = await pool.query(`
      SELECT 
        COALESCE(owner_gender, 'Unknown') as gender,
        COUNT(*) as count
      FROM survey_results
      GROUP BY COALESCE(owner_gender, 'Unknown')
      ORDER BY count DESC
    `)
    
    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0)
    
    const distribution = result.rows.map((row) => ({
      gender: row.gender,
      count: parseInt(row.count),
      percentage: total > 0 ? Math.round((parseInt(row.count) / total) * 100) : 0,
    }))
    
    await pool.end()
    
    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching gender distribution:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gender distribution' },
      { status: 500 }
    )
  }
}
