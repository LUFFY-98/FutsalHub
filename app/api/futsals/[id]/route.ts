import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const date = new URL(req.url).searchParams.get("date");
  const futsal = (await q("SELECT id,name,address,lat,lng FROM futsals WHERE id=?", [id]))[0];
  if (!futsal) return NextResponse.json({ error: "Futsal not found." }, { status: 404 });
  const prices = await q("SELECT dow,price FROM pricing WHERE futsal_id=? ORDER BY dow", [id]);
  let booked: number[] = [];
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date))
    booked = (await q("SELECT start_hour FROM bookings WHERE futsal_id=? AND play_date=?", [id, date])).map((r) => r.start_hour);
  return NextResponse.json({ futsal, prices, booked });
}

// Owner edits pricing: body { prices: number[7] } (index = day of week, 0 = Sunday)
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const u = await getUser();
  const owns = u && (await q("SELECT id FROM futsals WHERE id=? AND owner_id=?", [id, u.id])).length;
  if (!owns) return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  const { prices } = await req.json();
  if (!Array.isArray(prices) || prices.length !== 7 || prices.some((p) => !Number.isInteger(p) || p < 0))
    return NextResponse.json({ error: "Provide 7 valid prices." }, { status: 400 });
  for (let d = 0; d < 7; d++)
    await q("REPLACE INTO pricing(futsal_id,dow,price) VALUES(?,?,?)", [id, d, prices[d]]);
  return NextResponse.json({ ok: true });
}
