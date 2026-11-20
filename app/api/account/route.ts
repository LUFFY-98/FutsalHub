import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { checkPw, clearSession, getUser } from "@/lib/auth";

// Deletes the logged-in user. Foreign keys (ON DELETE CASCADE) also remove their
// futsal, its prices and every booking on it, or the player's own bookings.
export async function DELETE(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Log in first." }, { status: 401 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  const row = (await q("SELECT password_hash FROM users WHERE id=?", [u.id]))[0];
  if (!row || !password || !checkPw(String(password), row.password_hash))
    return NextResponse.json({ error: "Password is incorrect." }, { status: 403 });
  await q("DELETE FROM users WHERE id=?", [u.id]);
  await clearSession();
  return NextResponse.json({ ok: true });
}