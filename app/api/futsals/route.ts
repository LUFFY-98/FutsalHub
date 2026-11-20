import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";

// GET /api/futsals          -> all futsals
// GET /api/futsals?mine=1   -> the logged-in owner's futsal
export async function GET(req: Request) {
  try {
    const mine = new URL(req.url).searchParams.get("mine");
    let where = "";
    let args: unknown[] = [];
    if (mine) {
      const u = await getUser();
      if (!u || u.role !== "owner") return NextResponse.json([], { status: 401 });
      where = "WHERE f.owner_id=?";
      args = [u.id];
    }
    const rows = await q(`SELECT f.id,f.name,f.address,f.lat,f.lng,
      (SELECT price FROM pricing WHERE futsal_id=f.id AND dow=1) AS weekday,
      (SELECT price FROM pricing WHERE futsal_id=f.id AND dow=6) AS weekend
      FROM futsals f ${where} ORDER BY f.name`, args);
    return NextResponse.json(rows.map((r) => ({ ...r, lat: Number(r.lat), lng: Number(r.lng) })));
  } catch (e) {
    console.error("GET /api/futsals failed:", e);
    return NextResponse.json({ error: "Could not reach the database. Check the terminal." }, { status: 500 });
  }
}