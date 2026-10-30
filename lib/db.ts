import mysql from "mysql2/promise";
const g = globalThis as unknown as { pool?: mysql.Pool };
export const pool = (g.pool ??= mysql.createPool({ uri: process.env.DATABASE_URL!, dateStrings: true }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function q<T = any>(sql: string, p: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, p);
  return rows as T[];
}
