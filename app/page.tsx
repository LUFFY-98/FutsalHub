import Link from "next/link";
import { q } from "@/lib/db";
import { getUser } from "@/lib/auth";
import MapEmbed from "@/components/MapEmbed";

const fmt = (h: number) => `${h > 12 ? h - 12 : h}${h >= 12 ? "pm" : "am"}`;

export default async function Home() {
  const user = await getUser();
  const futsals = await q(`SELECT f.id,f.name,f.address,
    (SELECT price FROM pricing WHERE futsal_id=f.id AND dow=1) AS weekday,
    (SELECT price FROM pricing WHERE futsal_id=f.id AND dow=6) AS weekend FROM futsals f ORDER BY f.name`);
  const mine = user?.role === "player"
    ? await q(`SELECT b.id,b.play_date,b.start_hour,f.name FROM bookings b JOIN futsals f ON f.id=b.futsal_id
        WHERE b.user_id=? AND b.play_date>=CURDATE() ORDER BY b.play_date,b.start_hour LIMIT 5`, [user.id]) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section id="futsals" className="rounded-lg bg-[var(--panel)] p-5">
        <h2 className="mx-auto mb-4 w-fit rounded bg-[var(--bar)] px-8 py-2 font-semibold">Available futsals</h2>
        <div className="space-y-4">
          {futsals.length === 0 && <p className="rounded bg-[var(--bar)] p-4">No futsals yet. Owners can register to list theirs.</p>}
          {futsals.map((f) => (
            <Link key={f.id} href={`/futsals/${f.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded bg-[var(--bar)] p-5 hover:bg-white">
              <span className="font-semibold">{f.name}<span className="block text-sm font-normal text-slate-600">{f.address}</span></span>
              <span className="text-sm">NPR {f.weekday} per hour · Sat/Sun NPR {f.weekend}</span>
            </Link>
          ))}
        </div>
      </section>
      <aside className="space-y-4">
        <div className="rounded-lg bg-[var(--bar)] p-5">
          <h2 className="mb-3 font-semibold">Your bookings</h2>
          {!user && <p className="text-sm">Log in to see your bookings.</p>}
          {user && mine.length === 0 && <p className="text-sm">No upcoming bookings. Pick a futsal to book a slot.</p>}
          <ul className="space-y-2 text-sm">
            {mine.map((b) => <li key={b.id} className="rounded bg-white/70 p-2">{b.name}<br />{b.play_date}, {fmt(b.start_hour)}–{fmt(b.start_hour + 1)}</li>)}
          </ul>
        </div>
        <Link href="/map" className="block rounded-lg bg-[var(--bar)] p-3" title="Open full map">
          <MapEmbed q="futsal Kathmandu" className="pointer-events-none h-52" />
          <span className="mt-2 block text-center text-sm font-medium">Open map</span>
        </Link>
      </aside>
    </div>
  );
}
