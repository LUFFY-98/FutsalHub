import { NextResponse } from "next/server";
import { q, pool } from "@/lib/db";
import { passwordOk, validCoords } from "@/lib/validate";
import { checkPw, clearSession, hashPw, setSession } from "@/lib/auth";

export async function POST(req: Request) {
  const b = await req.json();
  if (b.action === "logout") { await clearSession(); return NextResponse.json({ ok: true }); }
  const email = String(b.email ?? "").trim().toLowerCase();
  const password = String(b.password ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email) || !password)
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });

  if (b.action === "login") {
    const u = (await q("SELECT id,password_hash FROM users WHERE email=?", [email]))[0];
    if (!u || !checkPw(password, u.password_hash))
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    await setSession(u.id);
    return NextResponse.json({ ok: true });
  }

  // register
  const name = String(b.name ?? "").trim();
  const role = b.role === "owner" ? "owner" : "player";
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (role === "owner" && !String(b.futsalName ?? "").trim())
    return NextResponse.json({ error: "Futsal name is required for owners." }, { status: 400 });
  if (!passwordOk(password))
    return NextResponse.json({ error: "Password needs 8+ characters, a capital letter, a number and a special character." }, { status: 400 });
  const lat = Number(b.lat), lng = Number(b.lng);
  if (role === "owner" && !validCoords(lat, lng))
    return NextResponse.json({ error: "Enter the exact latitude and longitude of your futsal." }, { status: 400 });
  if ((await q("SELECT id FROM users WHERE email=?", [email])).length)
    return NextResponse.json({ error: "That email is already registered." }, { status: 409 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.query("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)", [name, email, hashPw(password), role]);
    const uid = (r as { insertId: number }).insertId;
    if (role === "owner") {
      const [f] = await conn.query("INSERT INTO futsals(owner_id,name,address,lat,lng) VALUES(?,?,?,?,?)",
        [uid, b.futsalName.trim(), b.address ?? null, lat, lng]);
      const fid = (f as { insertId: number }).insertId;
      for (let d = 0; d < 7; d++)
        await conn.query("INSERT INTO pricing VALUES(?,?,?)", [fid, d, d === 0 || d === 6 ? 1400 : 1200]);
    }
    await conn.commit();
    await setSession(uid);
    return NextResponse.json({ ok: true });
  } catch { await conn.rollback(); return NextResponse.json({ error: "Could not register." }, { status: 500 }); }
  finally { conn.release(); }
}