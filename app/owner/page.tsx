"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const VenueMap = dynamic(() => import("@/components/VenueMap"), { ssr: false });

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
type F = { id: number; name: string; address: string | null; lat: number; lng: number };
type B = { id: number; play_date: string; start_hour: number; price: number; who: string };

export default function Owner() {
  const [f, setF] = useState<F | null>(null);
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");
  const [prices, setPrices] = useState<number[]>(Array(7).fill(0));
  const [history, setHistory] = useState<B[]>([]);
  const [msg, setMsg] = useState("");
  const [pw, setPw] = useState("");
  const [delMsg, setDelMsg] = useState("");

  useEffect(() => {
    fetch("/api/futsals?mine=1").then(async (r) => {
      const list: F[] = r.ok ? await r.json() : [];
      if (!list[0]) return setState("denied");
      setF(list[0]); setState("ok");
      fetch(`/api/futsals/${list[0].id}`).then((x) => x.json()).then((d) => setPrices(d.prices.map((p: { price: number }) => p.price)));
      fetch("/api/bookings").then((x) => x.json()).then(setHistory);
    });
  }, []);

  async function save() {
    if (!f) return;
    const r = await fetch(`/api/futsals/${f.id}`, { method: "PUT", body: JSON.stringify({ prices, address: f.address, lat: f.lat, lng: f.lng }) });
    setMsg(r.ok ? "Changes saved." : (await r.json()).error);
  }
  async function deleteAccount() {
    if (!confirm("Delete your account, your futsal and all its bookings? This cannot be undone.")) return;
    const r = await fetch("/api/account", { method: "DELETE", body: JSON.stringify({ password: pw }) });
    if (r.ok) location.href = "/";
    else setDelMsg((await r.json()).error);
  }
  if (state === "loading") return <p className="muted">Loading…</p>;
  if (state === "denied" || !f) return <p>Log in with an owner account to manage your futsal.</p>;
  const revenue = history.reduce((s, b) => s + b.price, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-3xl font-black">{f.name}</h1>
        <p className="muted">{history.length} bookings · Rs. {revenue.toLocaleString("en-IN")} earned</p>
        <h2 className="pt-2 font-bold">Price per hour (Rs.)</h2>
        {DAYS.map((d, i) => (
          <label key={d} className="flex items-center gap-3">
            <span className="chip w-32">{d}</span>
            <input type="number" min={0} className="field !w-36" value={prices[i]} onChange={(e) => setPrices(prices.map((p, j) => (j === i ? Number(e.target.value) : p)))} />
          </label>
        ))}
        <h2 className="pt-2 font-bold">Location</h2>
        <input className="field" placeholder="Address" value={f.address ?? ""} onChange={(e) => setF({ ...f, address: e.target.value })} />
        <div className="flex gap-3">
          <input className="field" type="number" step="any" aria-label="Latitude" value={f.lat} onChange={(e) => setF({ ...f, lat: Number(e.target.value) })} />
          <input className="field" type="number" step="any" aria-label="Longitude" value={f.lng} onChange={(e) => setF({ ...f, lng: Number(e.target.value) })} />
        </div>
        <button className="btn" onClick={save}>Save changes</button>
        {msg && <p role="status" className="text-sm">{msg}</p>}

        <div className="card mt-8 space-y-3 p-5" style={{ borderColor: "#ef4444" }}>
          <h2 className="font-bold text-red-400">Delete account</h2>
          <p className="text-sm muted">This permanently removes your account, your futsal, its prices and every booking made on it.</p>
          <input type="password" className="field" placeholder="Enter your password to confirm" value={pw} onChange={(e) => setPw(e.target.value)} />
          {delMsg && <p role="alert" className="text-sm text-red-400">{delMsg}</p>}
          <button type="button" disabled={!pw} onClick={deleteAccount}
            className="rounded-full border border-red-500 px-5 py-2 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-40">
            Delete my account
          </button>
        </div>
      </section>
      <section className="space-y-6">
        <div className="card max-h-96 overflow-auto p-5">
          <h2 className="mb-3 font-bold">History of bookings</h2>
          {history.length === 0 && <p className="text-sm muted">No bookings yet.</p>}
          <ul className="space-y-2 text-sm">
            {history.map((b) => <li key={b.id} className="chip flex justify-between"><span>{b.who} · {b.play_date}, {b.start_hour}:00</span><span>Rs. {b.price}</span></li>)}
          </ul>
        </div>
        <VenueMap height={300} venues={[{ id: f.id, name: f.name, lat: f.lat, lng: f.lng, distance: null }]} />
      </section>
    </div>
  );
}