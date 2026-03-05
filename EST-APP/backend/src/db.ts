import pg from "pg";
import { config } from "./config.js";

export const pool = new pg.Pool({
  connectionString: config.databaseUrl
});

export async function query<T>(text: string, params: unknown[] = []) {
  const res = await pool.query<T>(text, params);
  return res;
}