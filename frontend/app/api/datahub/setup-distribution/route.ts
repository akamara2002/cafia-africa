import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const result = await pool.query(`
      SELECT 
        business_type as setup_type,
        COUNT(*) as count
      FROM survey_results
      WHERE business_type IS NOT NULL AND business_type != ''
      GROUP BY business_type
      ORDER BY count DESC
    `)
    
    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0)
    
    const distribution = result.rows.map((row) => ({
      setup_type: row.setup_type,
      count: parseInt(row.count),
      percentage: total > 0 ? Math.round((parseInt(row.count) / total) * 100) : 0,
    }))
    
    await pool.end()
    
    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching setup distribution:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setup distribution' },
      { status: 500 }
    )
  }
}
