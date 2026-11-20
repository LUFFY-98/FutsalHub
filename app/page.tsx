"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const VenueMap = dynamic(() => import("@/components/VenueMap"), { ssr: false });

type Futsal = { id: number; name: string; address: string | null; lat: number; lng: number; weekday: number; weekend: number };
type Booking = { id: number; play_date: string; start_hour: number; who: string };

function km(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const hr = (h: number) => `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;

export default function Home() {
  const [futsals, setFutsals] = useState<Futsal[] | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [maxDistance, setMaxDistance] = useState("any");
  const [loc, setLoc] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locMsg, setLocMsg] = useState("");

  useEffect(() => {
    fetch("/api/futsals").then((r) => r.json()).then(setFutsals);
    fetch("/api/bookings").then((r) => (r.ok ? r.json() : [])).then((b: Booking[] & { play_date: string }[]) => {
      const today = new Date().toISOString().slice(0, 10);
      setBookings(b.filter((x) => x.play_date >= today).reverse().slice(0, 5));
    });
  }, []);

  function locate() {
    if (!navigator.geolocation) return setLocMsg("Your browser does not support location.");
    setLocMsg("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setLoc({ latitude: p.coords.latitude, longitude: p.coords.longitude }); setLocMsg("Location found."); },
      (e) => setLocMsg(e.code === e.PERMISSION_DENIED ? "Location permission was denied." : "Could not get your location. Try again."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const shown = (futsals ?? [])
    .filter((f) => `${f.name} ${f.address ?? ""}`.toLowerCase().includes(search.toLowerCase()))
    .map((f) => ({ ...f, distance: loc ? km(loc.latitude, loc.longitude, f.lat, f.lng) : null }))
    .filter((f) => !loc || maxDistance === "any" || (f.distance ?? 0) <= Number(maxDistance))
    .sort((a, b) => (a.distance !== null && b.distance !== null ? a.distance - b.distance : 0));

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 py-6 md:grid-cols-[3fr_2fr]">
        <div>
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Find your next <span className="block" style={{ color: "var(--primary)" }}>futsal match.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg muted">Pick a court near you, see which hours are free, and book your slot in a few taps.</p>
          <a href="#venues" className="btn mt-7 inline-block">Explore courts</a>
        </div>
        <div className="card p-6">
          <h2 className="mb-3 font-bold">Your bookings</h2>
          {bookings.length === 0 && <p className="text-sm muted">No upcoming bookings. Choose a futsal below to book a slot.</p>}
          <ul className="space-y-2 text-sm">
            {bookings.map((b) => (
              <li key={b.id} className="chip">{b.who}<span className="block muted">{b.play_date}, {hr(b.start_hour)}–{hr(b.start_hour + 1)}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section id="venues" className="scroll-mt-24 space-y-5">
        <h2 className="text-3xl font-black">Explore futsal venues</h2>
       

        <div id="map" className="scroll-mt-24 pt-4">
          <VenueMap userLocation={loc} venues={shown.map((f) => ({ id: f.id, name: f.name, lat: f.lat, lng: f.lng, distance: f.distance }))} />
        </div>

        {futsals === null && <p className="muted">Loading futsals…</p>}
        {futsals?.length === 0 && <p className="muted">No futsals listed yet. Owners can sign up to add theirs.</p>}
        {futsals && futsals.length > 0 && shown.length === 0 && <p className="muted">No futsals match. Try a wider distance or a different search.</p>}
        <div className="grid gap-6 md:grid-cols-3">
          {shown.map((f) => (
            <article key={f.id} className="card p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-bold">{f.name}</h3>
              <p className="mt-1 text-sm muted">{f.address || "Address not provided"}</p>
              {f.distance !== null && <p className="mt-2 text-sm font-semibold" style={{ color: "var(--primary)" }}>{f.distance.toFixed(2)} km away</p>}
              <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm font-bold">Rs. {f.weekday?.toLocaleString("en-IN")} / hour<span className="block text-xs font-normal muted">Sat–Sun Rs. {f.weekend?.toLocaleString("en-IN")}</span></span>
                <Link href={`/futsals/${f.id}`} className="btn-outline text-sm">View and book</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
