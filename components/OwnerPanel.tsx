"use client";
import { useEffect, useState } from "react";
import MapEmbed from "./MapEmbed";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function OwnerPanel({ futsal }: { futsal: { id: number; name: string; lat: number; lng: number } }) {
  const [prices, setPrices] = useState<number[]>(Array(7).fill(0));
  const [history, setHistory] = useState<{ id: number; play_date: string; start_hour: number; price: number; who: string }[]>([]);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch(`/api/futsals/${futsal.id}`).then((r) => r.json()).then((d) => setPrices(d.prices.map((p: { price: number }) => p.price)));
    fetch("/api/bookings").then((r) => r.json()).then(setHistory);
  }, [futsal.id]);

  async function save() {
    const r = await fetch(`/api/futsals/${futsal.id}`, { method: "PUT", body: JSON.stringify({ prices }) });
    setMsg(r.ok ? "Prices saved." : (await r.json()).error);
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">{futsal.name}</h1>
        <h2 className="font-semibold">Pricing per hour (NPR)</h2>
        {DAYS.map((d, i) => (
          <label key={d} className="flex items-center gap-3">
            <span className="w-28 rounded bg-[var(--bar)] px-3 py-2">{d}</span>
            <input type="number" min={0} className="input w-32" value={prices[i]}
              onChange={(e) => setPrices(prices.map((p, j) => (j === i ? Number(e.target.value) : p)))} />
          </label>
        ))}
        <button className="btn" onClick={save}>Save prices</button>
        {msg && <p role="status" className="text-sm">{msg}</p>}
      </section>
      <section className="space-y-4">
        <div className="max-h-80 overflow-auto rounded-lg bg-[var(--bar)] p-5">
          <h2 className="mb-3 font-semibold">History of bookings</h2>
          {history.length === 0 && <p className="text-sm">No bookings yet.</p>}
          <ul className="space-y-2 text-sm">
            {history.map((b) => <li key={b.id} className="flex justify-between rounded bg-white/70 p-2">
              <span>{b.who} · {b.play_date}, {b.start_hour}:00</span><span>NPR {b.price}</span></li>)}
          </ul>
        </div>
        <MapEmbed q={`${futsal.lat},${futsal.lng}`} />
      </section>
    </div>
  );
}
