"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type U = { name: string; role: "player" | "owner" } | null;
export default function Nav() {
  const path = usePathname();
  const [user, setUser] = useState<U>(null);
  useEffect(() => { fetch("/api/me").then((r) => r.json()).then((d) => setUser(d.user)); }, [path]);
  async function logout() {
    await fetch("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) });
    location.href = "/";
  }
  const links = [
    { href: "/", label: "Home" },
    { href: "/futsals", label: "Futsals" },
    { href: "/map", label: "Map" },
    ...(user?.role === "player" ? [{ href: "/bookings", label: "My bookings" }] : []),
    ...(user?.role === "owner" ? [{ href: "/owner", label: "My futsal" }] : []),
  ];
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <header className="sticky top-0 z-2000 border-b backdrop-blur-md" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surface) 92%, transparent)" }}>
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 md:px-16">
        <Link href="/" className="text-2xl font-black tracking-tight">Futsal<span style={{ color: "var(--primary)" }}>Hub.</span></Link>
        <div className="order-3 flex w-full items-center gap-6 text-sm font-medium md:order-0 md:w-auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
              className={active(l.href) ? "border-b-2 pb-1" : "muted pb-1 hover:text-white"}
              style={active(l.href) ? { borderColor: "var(--primary)" } : undefined}>{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {user ? (<><span className="hidden muted sm:inline">{user.name}</span><button onClick={logout} className="btn-outline">Log out</button></>)
                : <Link href="/login" className="btn">Log in</Link>}
        </div>
      </nav>
    </header>
  );
}