import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  const u = await getUser();
  if (!u) return NextResponse.json([], { status: 401 });
  const rows = u.role === "owner"
    ? await q(`SELECT b.id,b.play_date,b.start_hour,b.price,u.name AS who FROM bookings b
        JOIN futsals f ON f.id=b.futsal_id JOIN users u ON u.id=b.user_id
        WHERE f.owner_id=? ORDER BY b.play_date DESC,b.start_hour DESC`, [u.id])
    : await q(`SELECT b.id,b.play_date,b.start_hour,b.price,f.name AS who FROM bookings b
        JOIN futsals f ON f.id=b.futsal_id WHERE b.user_id=? ORDER BY b.play_date DESC,b.start_hour DESC`, [u.id]);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const u = await getUser();
  if (!u || u.role !== "player") return NextResponse.json({ error: "Log in as a player to book." }, { status: 401 });
  const { futsalId, date, hour } = await req.json();
  const today = new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || !Number.isInteger(hour) || hour < 6 || hour > 20)
    return NextResponse.json({ error: "Invalid date or time." }, { status: 400 });
  const dow = new Date(date + "T00:00:00").getDay();
  const p = (await q("SELECT price FROM pricing WHERE futsal_id=? AND dow=?", [futsalId, dow]))[0];
  if (!p) return NextResponse.json({ error: "Futsal not found." }, { status: 404 });
  try {
    await q("INSERT INTO bookings(futsal_id,user_id,play_date,start_hour,price) VALUES(?,?,?,?,?)", [futsalId, u.id, date, hour, p.price]);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "ER_DUP_ENTRY")
      return NextResponse.json({ error: "That slot was just booked. Pick another time." }, { status: 409 });
    return NextResponse.json({ error: "Booking failed." }, { status: 500 });
  }
}
