
const path = require("path");
require("dotenv").config({
  path: path.join(process.cwd(), ".env.local"),
});

const { Pool } = require("pg");

async function createUsersTable() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error(
      "DATABASE_URL is missing. Check your .env.local file."
    );
    process.exitCode = 1;
    return;
  }

  const pool = new Pool({ connectionString });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log("SUCCESS: PostgreSQL users table is ready.");

    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.table(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createUsersTable();
