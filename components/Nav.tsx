import Link from "next/link";
import { getUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
export default async function Nav() {
  const u = await getUser();
  return (
    <header className="bg-[var(--bar)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">Futsal Management</Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/map">Map</Link>
          <Link href="/#futsals">Futsals</Link>
          {u?.role === "owner" && <Link href="/owner">My futsal</Link>}
          {u ? <><span className="text-slate-600">{u.name}</span><LogoutButton /></> : <Link href="/login" className="btn">Log in</Link>}
        </div>
      </nav>
    </header>
  );
}
