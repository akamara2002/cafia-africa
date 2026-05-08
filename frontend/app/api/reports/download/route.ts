import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db"

export async function POST(request: Request) {
  let pool: Awaited<ReturnType<typeof getDbConnection>> | null = null

  try {
    const body = await request.json()
    const { email, reportSlug, reportTitle, latitude, longitude, locationAccuracyM, locationStatus } = body ?? {}

    if (!email || !reportSlug || !reportTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    pool = await getDbConnection()

    await pool.query(`
      CREATE TABLE IF NOT EXISTS report_download_logs (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        report_slug TEXT NOT NULL,
        report_title TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        location_accuracy_m DOUBLE PRECISION,
        location_status TEXT,
        downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await pool.query(`ALTER TABLE report_download_logs ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`)
    await pool.query(`ALTER TABLE report_download_logs ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`)
    await pool.query(`ALTER TABLE report_download_logs ADD COLUMN IF NOT EXISTS location_accuracy_m DOUBLE PRECISION`)
    await pool.query(`ALTER TABLE report_download_logs ADD COLUMN IF NOT EXISTS location_status TEXT`)

    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress =
      (forwardedFor ? forwardedFor.split(",")[0]?.trim() : null) ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-vercel-forwarded-for")
    const userAgent = request.headers.get("user-agent")

    const lat = Number.isFinite(Number(latitude)) ? Number(latitude) : null
    const lon = Number.isFinite(Number(longitude)) ? Number(longitude) : null
    const accuracy = Number.isFinite(Number(locationAccuracyM)) ? Number(locationAccuracyM) : null
    const status = typeof locationStatus === "string" && locationStatus.length > 0 ? locationStatus : "unknown"

    await pool.query(
      `
      INSERT INTO report_download_logs (
        email, report_slug, report_title, ip_address, user_agent, latitude, longitude, location_accuracy_m, location_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [email, reportSlug, reportTitle, ipAddress, userAgent, lat, lon, accuracy, status],
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error logging report download:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  } finally {
    if (pool) {
      await pool.end()
    }
  }
}
