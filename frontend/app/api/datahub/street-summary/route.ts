import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const street = searchParams.get('street')
    
    if (!street) {
      return NextResponse.json(
        { error: 'Street parameter is required' },
        { status: 400 }
      )
    }
    
    const pool = await getDbConnection()
    
    // Get total count
    const totalResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM survey_results
      WHERE street_standardized = $1
    `, [street])
    const total = parseInt(totalResult.rows[0].count)
    
    // Get setup type breakdown
    const setupResult = await pool.query(`
      SELECT 
        business_type,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized = $1
        AND business_type IS NOT NULL AND business_type != ''
      GROUP BY business_type
    `, [street])
    
    const shops = setupResult.rows.find((r) => r.business_type === 'Shop')?.count || 0
    const tables = setupResult.rows.find((r) => r.business_type === 'Table')?.count || 0
    const kiosks = setupResult.rows.find((r) => r.business_type === 'Kiosk')?.count || 0
    
    // Get activity breakdown
    const activityResult = await pool.query(`
      SELECT 
        activity_type,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized = $1
        AND activity_type IS NOT NULL AND activity_type != ''
      GROUP BY activity_type
    `, [street])
    
    const retail = activityResult.rows.find((r) => r.activity_type.toLowerCase().includes('retail'))?.count || 0
    const services = activityResult.rows.find((r) => r.activity_type.toLowerCase().includes('service'))?.count || 0
    const retailPct = total > 0 ? Math.round((retail / total) * 100) : 0
    const servicesPct = total > 0 ? Math.round((services / total) * 100) : 0
    
    // Get gender breakdown
    const genderResult = await pool.query(`
      SELECT 
        COALESCE(owner_gender, 'Unknown') as gender,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized = $1
      GROUP BY COALESCE(owner_gender, 'Unknown')
    `, [street])
    
    const female = genderResult.rows.find((r) => r.gender === 'Female')?.count || 0
    const femalePct = total > 0 ? Math.round((female / total) * 100) : 0
    
    await pool.end()
    
    return NextResponse.json({
      street_name: street,
      total,
      shops: parseInt(shops),
      tables: parseInt(tables),
      kiosks: parseInt(kiosks),
      retail_pct: retailPct,
      services_pct: servicesPct,
      female_pct: femalePct,
    })
  } catch (error) {
    console.error('Error fetching street summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch street summary' },
      { status: 500 }
    )
  }
}
