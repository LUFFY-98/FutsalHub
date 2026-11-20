"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const VenueMap = dynamic(() => import("@/components/VenueMap"), { ssr: false });

const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6am – 9pm start
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const t = (h: number) => (h > 12 ? h - 12 : h);
const label = (h: number) => `${t(h)}–${t(h + 1)}`;
type Data = { futsal: { id: number; name: string; address: string | null; lat: number; lng: number }; prices: { dow: number; price: number }[]; booked: number[]; mine: { id: number; hour: number }[] };

export default function FutsalClient({ id }: { id: string }) {
  const [days] = useState(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }));
  const [date, setDate] = useState(iso(days[0]));
  const [data, setData] = useState<Data | null>(null);
  const [missing, setMissing] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await fetch(`/api/futsals/${id}?date=${date}`);
    if (r.ok) setData(await r.json()); else setMissing(true);
  }, [id, date]);
  useEffect(() => { load(); }, [load]);

  async function book(hour: number) {
    const r = await fetch("/api/bookings", { method: "POST", body: JSON.stringify({ futsalId: Number(id), date, hour }) });
    const d = await r.json();
    setMsg({ ok: r.ok, text: r.ok ? `Booked ${date}, ${label(hour)}.` : r.status === 401 ? "Log in as a player to book a slot." : d.error });
    load();
  }

  async function cancel(bid: number) {
    if (!confirm("Cancel this booking?")) return;
    const r = await fetch(`/api/bookings?id=${bid}`, { method: "DELETE" });
    const d = await r.json();
    setMsg({ ok: r.ok, text: r.ok ? "Booking cancelled." : d.error });
    load();
  }

  if (missing) return <div className="py-20 text-center"><h1 className="text-3xl font-black">Futsal not found</h1><Link href="/" className="btn mt-6 inline-block">Back to home</Link></div>;
  if (!data) return <p className="muted">Loading…</p>;
  const sel = new Date(date + "T00:00:00");
  const dow = sel.getDay();
  const price = data.prices.find((p) => p.dow === dow)?.price;

  return (
    <div className="space-y-6">
      <Link href="/" className="font-semibold" style={{ color: "var(--primary)" }}>← Back to home</Link>
      <header>
        <h1 className="text-3xl font-black md:text-4xl">{data.futsal.name}</h1>
        <p className="mt-1 muted">{data.futsal.address || "Address not provided"}</p>
        <p className="mt-3 text-lg">{sel.toLocaleString("en", { month: "long" })}, week {Math.ceil(sel.getDate() / 7)} · {DAYS[dow]} · <strong style={{ color: "var(--primary)" }}>Rs. {price?.toLocaleString("en-IN")} / hour</strong></p>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a day">
        {days.map((d) => (
          <button key={iso(d)} className="chip" aria-pressed={iso(d) === date} onClick={() => { setDate(iso(d)); setMsg(null); }}>
            {DAYS[d.getDay()].slice(0, 3)} {d.getDate()}
          </button>
        ))}
      </div>

      <div className="flex gap-5 text-sm">
        <span><i className="slot-free mr-2 inline-block h-3 w-3 rounded align-middle" />Available</span>
        <span><i className="slot-booked mr-2 inline-block h-3 w-3 rounded align-middle" />Booked</span>
      </div>
      {msg && <p role="status" className={`font-medium ${msg.ok ? "" : "text-red-500"}`}>{msg.text}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {HOURS.map((h) => {
          const mine = data.mine.find((m) => m.hour === h);
          const taken = data.booked.includes(h);
          if (mine) return (
            <button key={h} onClick={() => cancel(mine.id)} className="slot-booked rounded-xl py-4 font-semibold ring-2 ring-white/80 hover:brightness-110">
              {label(h)}<span className="block text-xs font-normal">Your booking · tap to cancel</span>
            </button>
          );
          return (
            <button key={h} disabled={taken} onClick={() => book(h)}
              className={`rounded-xl py-4 font-semibold transition ${taken ? "slot-booked cursor-not-allowed opacity-80" : "slot-free hover:brightness-110"}`}>
              {label(h)}<span className="block text-xs font-normal">{taken ? "Booked" : "Available"}</span>
            </button>
          );
        })}
      </div>

      <VenueMap height={320} venues={[{ id: data.futsal.id, name: data.futsal.name, lat: data.futsal.lat, lng: data.futsal.lng, distance: null }]} />
    </div>
  );
}