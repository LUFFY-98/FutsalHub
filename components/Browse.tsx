"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const VenueMap = dynamic(() => import("./VenueMap"), { ssr: false });

type Futsal = { id: number; name: string; address: string | null; lat: number; lng: number; weekday: number; weekend: number };

export default function Browse({ show }: { show: "list" | "map" }) {
  const [futsals, setFutsals] = useState<Futsal[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/futsals")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setFutsals)
      .catch(() => { setFutsals([]); setError("Could not load futsals. Check the database connection."); });
  }, []);

  const shown = (futsals ?? []).filter((f) => `${f.name} ${f.address ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">{show === "list" ? "Explore futsals" : "Futsals on the map"}</h1>
      {show === "list" && (
        <input type="search" aria-label="Search futsals" placeholder="Search by name or location…" className="field" value={search} onChange={(e) => setSearch(e.target.value)} />
      )}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {show === "map" && (
        <VenueMap height={560} venues={(futsals ?? []).map((f) => ({ id: f.id, name: f.name, lat: f.lat, lng: f.lng, distance: null }))} />
      )}
      {futsals === null && <p className="muted">Loading futsals…</p>}
      {futsals?.length === 0 && !error && <p className="muted">No futsals listed yet. Owners can sign up to add theirs.</p>}
      {show === "list" && (
        <div className="grid gap-6 md:grid-cols-3">
          {shown.map((f) => (
            <article key={f.id} className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-bold">{f.name}</h3>
              <p className="mt-1 text-sm muted">{f.address || "Address not provided"}</p>
              <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm font-bold">Rs. {f.weekday?.toLocaleString("en-IN")} / hour<span className="block text-xs font-normal muted">Sat–Sun Rs. {f.weekend?.toLocaleString("en-IN")}</span></span>
                <Link href={`/futsals/${f.id}`} className="btn-outline text-sm">View and book</Link>
              </div>
            </article>
          ))}
          {futsals && futsals.length > 0 && shown.length === 0 && <p className="muted">No futsals match your search.</p>}
        </div>
      )}
    </div>
  );
}