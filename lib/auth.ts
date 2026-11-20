import crypto from "crypto";
import { cookies } from "next/headers";
import { q } from "./db";
const secret = process.env.AUTH_SECRET || "dev-secret";
const sign = (v: string) => crypto.createHmac("sha256", secret).update(v).digest("hex");
export const hashPw = (p: string) => {
  const s = crypto.randomBytes(16).toString("hex");
  return s + ":" + crypto.scryptSync(p, s, 32).toString("hex");
};
export const checkPw = (p: string, h: string) => {
  const [s, k] = h.split(":");
  return crypto.timingSafeEqual(Buffer.from(k, "hex"), crypto.scryptSync(p, s, 32));
};
export async function setSession(id: number) {
  (await cookies()).set("sid", `${id}.${sign(String(id))}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 604800 });
}
export async function clearSession() { (await cookies()).delete("sid"); }
export type User = { id: number; name: string; email: string; role: "player" | "owner" };
export async function getUser(): Promise<User | null> {
  const c = (await cookies()).get("sid")?.value;
  if (!c) return null;
  const [id, sig] = c.split(".");
  if (sig !== sign(id)) return null;
  return (await q<User>("SELECT id,name,email,role FROM users WHERE id=?", [id]))[0] ?? null;
}
