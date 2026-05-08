import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    const result = await pool.query(`
      SELECT 
        business_type as setup_type,
        COALESCE(owner_gender, 'Unknown') as gender,
        COUNT(*) as count
      FROM survey_results
      WHERE business_type IS NOT NULL AND business_type != ''
      GROUP BY business_type, COALESCE(owner_gender, 'Unknown')
    `)
    
    // Get totals for percentages
    const totalResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM survey_results
      WHERE business_type IS NOT NULL AND business_type != ''
    `)
    const total = parseInt(totalResult.rows[0].total)
    
    // Organize into heatmap structure
    const heatmapData: Record<string, Record<string, { count: number; pct: number }>> = {}
    
    result.rows.forEach(row => {
      if (!heatmapData[row.setup_type]) {
        heatmapData[row.setup_type] = {}
      }
      const count = parseInt(row.count)
      heatmapData[row.setup_type][row.gender] = {
        count,
        pct: total > 0 ? (count / total) * 100 : 0,
      }
    })
    
    await pool.end()
    
    return NextResponse.json({
      data: heatmapData,
      total,
    })
  } catch (error) {
    console.error('Error fetching gender-setup heatmap:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    )
  }
}
