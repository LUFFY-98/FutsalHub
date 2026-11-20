"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type B = { id: number; futsal_id: number; play_date: string; start_hour: number; price: number; who: string };
const hr = (h: number) => `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;

export default function Bookings() {
  const [list, setList] = useState<B[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => {
    const r = await fetch("/api/bookings");
    if (!r.ok) return setDenied(true);
    setList(await r.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  async function cancel(id: number) {
    if (!confirm("Cancel this booking?")) return;
    const r = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
    setMsg(r.ok ? "Booking cancelled." : (await r.json()).error);
    load();
  }
  if (denied) return <p>Please <Link href="/login" className="underline">log in</Link> to see your bookings.</p>;
  if (!list) return <p className="muted">Loading…</p>;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = list.filter((b) => b.play_date >= today).reverse();
  const past = list.filter((b) => b.play_date < today);
  const row = (b: B, canCancel: boolean) => (
    <li key={b.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
      <span><Link href={`/futsals/${b.futsal_id}`} className="font-semibold hover:underline">{b.who}</Link>
        <span className="block text-sm muted">{b.play_date}, {hr(b.start_hour)}–{hr(b.start_hour + 1)} · Rs. {b.price}</span></span>
      {canCancel && <button className="btn-outline text-sm" onClick={() => cancel(b.id)}>Cancel booking</button>}
    </li>
  );
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">My bookings</h1>
      {msg && <p role="status" className="font-medium">{msg}</p>}
      <section className="space-y-3"><h2 className="font-bold">Upcoming</h2>
        {upcoming.length === 0 && <p className="text-sm muted">Nothing booked. <Link href="/futsals" className="underline">Find a futsal</Link>.</p>}
        <ul className="space-y-3">{upcoming.map((b) => row(b, true))}</ul></section>
      {past.length > 0 && <section className="space-y-3"><h2 className="font-bold">Past</h2><ul className="space-y-3">{past.map((b) => row(b, false))}</ul></section>}
    </div>
  );
}