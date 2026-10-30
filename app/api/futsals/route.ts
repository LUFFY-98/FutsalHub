import { NextResponse } from "next/server";
import { q } from "@/lib/db";
export async function GET() {
  const rows = await q(`SELECT f.id,f.name,f.address,f.lat,f.lng,
    (SELECT price FROM pricing WHERE futsal_id=f.id AND dow=1) AS weekday,
    (SELECT price FROM pricing WHERE futsal_id=f.id AND dow=6) AS weekend FROM futsals f ORDER BY f.name`);
  return NextResponse.json(rows);
}
