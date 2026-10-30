"use client";
import { use, useCallback, useEffect, useState } from "react";
import MapEmbed from "@/components/MapEmbed";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6am to 9pm start
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const label = (h: number) => `${h > 12 ? h - 12 : h}-${(h + 1) > 12 ? h + 1 - 12 : h + 1}`;

export default function FutsalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const [date, setDate] = useState(iso(days[0]));
  const [data, setData] = useState<{ futsal: { name: string; address: string; lat: number; lng: number }; prices: { dow: number; price: number }[]; booked: number[] } | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/futsals/${id}?date=${date}`);
    if (r.ok) setData(await r.json());
  }, [id, date]);
  useEffect(() => { load(); }, [load]);

  async function book(hour: number) {
    const r = await fetch("/api/bookings", { method: "POST", body: JSON.stringify({ futsalId: Number(id), date, hour }) });
    const d = await r.json();
    setMsg(r.ok ? `Booked ${date}, ${label(hour)}.` : d.error);
    load();
  }
  if (!data) return <p>Loading…</p>;
  const dow = new Date(date + "T00:00:00").getDay();
  const price = data.prices.find((p) => p.dow === dow)?.price;
  const sel = new Date(date + "T00:00:00");
  const week = Math.ceil(sel.getDate() / 7);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{data.futsal.name}</h1>
        <p className="text-slate-600">{sel.toLocaleString("en", { month: "long" })}, week {week} · {DAYS[dow]} · NPR {price} per hour</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {days.map((d) => (
          <button key={iso(d)} onClick={() => { setDate(iso(d)); setMsg(""); }}
            className={`rounded px-4 py-2 text-sm font-medium ${iso(d) === date ? "bg-[#1e3a5f] text-white" : "bg-[var(--bar)]"}`}>
            {DAYS[d.getDay()].slice(0, 3)} {d.getDate()}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4 text-sm">
        <span><i className="slot-free mr-1 inline-block h-3 w-3 rounded" />Available</span>
        <span><i className="slot-booked mr-1 inline-block h-3 w-3 rounded" />Booked</span>
      </div>
      {msg && <p role="status" className="text-center font-medium">{msg}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {HOURS.map((h) => {
          const taken = data.booked.includes(h);
          return <button key={h} disabled={taken} onClick={() => book(h)}
            className={`rounded-lg py-4 font-semibold ${taken ? "slot-booked cursor-not-allowed opacity-80" : "slot-free hover:brightness-110"}`}>
            {label(h)}<span className="block text-xs font-normal">{taken ? "Booked" : "Available"}</span></button>;
        })}
      </div>
      <MapEmbed q={`${data.futsal.lat},${data.futsal.lng}`} />
    </div>
  );
}
