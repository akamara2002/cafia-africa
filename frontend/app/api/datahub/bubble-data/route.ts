import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getDbConnection()
    
    // Get all streets with counts
    const streetsResult = await pool.query(`
      SELECT 
        street_standardized as street_name,
        COUNT(*) as total
      FROM survey_results
      WHERE street_standardized IS NOT NULL AND street_standardized != ''
      GROUP BY street_standardized
      ORDER BY total DESC
    `)
    
    const streets = streetsResult.rows.map(row => row.street_name)
    
    // Get gender breakdown
    const genderResult = await pool.query(`
      SELECT 
        street_standardized as street_name,
        COALESCE(owner_gender, 'Unknown') as gender,
        COUNT(*) as count
      FROM survey_results
      WHERE street_standardized = ANY($1::text[])
      GROUP BY street_standardized, COALESCE(owner_gender, 'Unknown')
    `, [streets])
    
    // Get setup diversity (count of distinct setup types per street)
    const diversityResult = await pool.query(`
      SELECT 
        street_standardized as street_name,
        COUNT(DISTINCT business_type) as diversity
      FROM survey_results
      WHERE street_standardized = ANY($1::text[])
        AND business_type IS NOT NULL AND business_type != ''
      GROUP BY street_standardized
    `, [streets])
    
    // Organize data
    const genderByStreet: Record<string, { total: number; female: number }> = {}
    streets.forEach(street => {
      genderByStreet[street] = { total: 0, female: 0 }
    })
    
    genderResult.rows.forEach(row => {
      if (genderByStreet[row.street_name]) {
        genderByStreet[row.street_name].total += parseInt(row.count)
        if (row.gender === 'Female') {
          genderByStreet[row.street_name].female += parseInt(row.count)
        }
      }
    })
    
    const diversityByStreet: Record<string, number> = {}
    diversityResult.rows.forEach(row => {
      diversityByStreet[row.street_name] = parseInt(row.diversity)
    })
    
    const result = streets.map(street => {
      const gender = genderByStreet[street]
      const diversity = diversityByStreet[street] || 0
      return {
        street_name: street,
        total: gender.total,
        female_pct: gender.total > 0 ? (gender.female / gender.total) * 100 : 0,
        setup_diversity: diversity,
      }
    })
    
    await pool.end()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching bubble data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bubble data' },
      { status: 500 }
    )
  }
}
