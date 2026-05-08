import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'
import { getStreetNormalizationSQL } from '@/lib/street-normalizer'

export async function GET() {
  try {
    const pool = await getDbConnection()

    const normalizedSQL = getStreetNormalizationSQL('street_standardized')
    
    // Get all streets with comprehensive breakdown (normalized)
    const result = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE business_type = 'Shop') as shops,
        COUNT(*) FILTER (WHERE business_type = 'Table') as tables,
        COUNT(*) FILTER (WHERE business_type = 'Kiosk') as kiosks,
        COUNT(*) FILTER (WHERE COALESCE(owner_gender, 'Unknown') = 'Female') as female_count,
        COUNT(*) FILTER (WHERE COALESCE(owner_gender, 'Unknown') = 'Male') as male_count
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY ${normalizedSQL}
      ORDER BY total DESC
    `)

    // Get activity breakdown per street (normalized)
    const activityResult = await pool.query(`
      SELECT 
        ${normalizedSQL} as street_name,
        activity_type,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized IS NOT NULL 
        AND activity_type IS NOT NULL 
        AND activity_type != ''
      GROUP BY ${normalizedSQL}, activity_type
    `)

    const activityByStreet: Record<string, Record<string, number>> = {}
    activityResult.rows.forEach((row) => {
      if (!activityByStreet[row.street_name]) {
        activityByStreet[row.street_name] = {}
      }
      activityByStreet[row.street_name][row.activity_type] = parseInt(row.count)
    })

    const cards = result.rows.map((row) => {
      const total = parseInt(row.total)
      const femaleCount = parseInt(row.female_count)
      const maleCount = parseInt(row.male_count)
      const femalePct = total > 0 ? (femaleCount / total) * 100 : 0
      const malePct = total > 0 ? (maleCount / total) * 100 : 0

      return {
        street_name: row.street_name,
        total,
        shops: parseInt(row.shops),
        tables: parseInt(row.tables),
        kiosks: parseInt(row.kiosks),
        female_pct: femalePct,
        male_pct: malePct,
        activity_breakdown: activityByStreet[row.street_name] || {},
      }
    })

    await pool.end()

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching street cards:', error)
    return NextResponse.json({ error: 'Failed to fetch street cards' }, { status: 500 })
  }
}
