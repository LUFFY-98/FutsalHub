import mysql from "mysql2/promise";
const g = globalThis as unknown as { pool?: mysql.Pool };
export const pool = (g.pool ??= mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function q<T = any>(sql: string, p: unknown[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, p);
  return rows as T[];
}
