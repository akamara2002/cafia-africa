// Database connection configuration
const DATABASE_URL = process.env.DATABASE_URL

// Direct database connection for server-side API routes
export async function getDbConnection() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Configure it in your environment variables.')
  }

  const { Pool } = await import('pg')
  const pool = new Pool({
    connectionString: DATABASE_URL,
  })
  return pool
}
