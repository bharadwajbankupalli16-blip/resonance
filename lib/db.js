
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from .env.local");
}

const globalForPg = globalThis;

export const db =
  globalForPg.pgPool ??
  new Pool({
    connectionString,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = db;
}
