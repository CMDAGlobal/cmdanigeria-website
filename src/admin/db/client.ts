import { Pool } from "@neondatabase/serverless";
import { adminDatabaseUrl } from "../config";

let pool: Pool | null = null;

/**
 * Lazy singleton connection pool. Only ever imported server-side (from scripts
 * or inside server-function handlers) so the client bundle never pulls in the
 * database driver.
 */
export function getPool(): Pool {
  if (pool) return pool;
  const connectionString = adminDatabaseUrl();
  if (!connectionString) {
    throw new Error("ADMIN_DATABASE_URL is not set");
  }
  pool = new Pool({ connectionString });
  return pool;
}

export async function query<Row>(sql: string, params?: unknown[]): Promise<Row[]> {
  const result = await getPool().query(sql, params);
  return result.rows as Row[];
}
