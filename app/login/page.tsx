"use client";
import { useState } from "react";
import { passwordRules, passwordOk, validCoords } from "@/lib/validate";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", password: "", role: "player", futsalName: "", address: "", lat: "", lng: "" });
  const [err, setErr] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const reg = mode === "register";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (reg && !passwordOk(f.password)) return setErr("Your password does not meet all the rules below.");
    if (reg && f.role === "owner" && !validCoords(Number(f.lat), Number(f.lng)))
      return setErr("Enter valid latitude and longitude, for example 27.7172 and 85.3240.");
    const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ action: mode, ...f, lat: Number(f.lat), lng: Number(f.lng) }) });
    const d = await r.json();
    if (!r.ok) return setErr(d.error);
    location.href = reg && f.role === "owner" ? "/owner" : "/";
  }
  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-3 p-6">
      <h1 className="text-xl font-bold">{reg ? "Create account" : "Log in"}</h1>
      {reg && <>
        <input className="field" placeholder="Full name" value={f.name} onChange={set("name")} required />
        <select className="field" value={f.role} onChange={set("role")} aria-label="Account type">
          <option value="player">I want to book futsals</option><option value="owner">I own a futsal</option>
        </select>
        {f.role === "owner" && <>
          <input className="field" placeholder="Futsal name" value={f.futsalName} onChange={set("futsalName")} required />
          <input className="field" placeholder="Address" value={f.address} onChange={set("address")} required />
          <div className="flex gap-3">
            <input className="field" inputMode="decimal" placeholder="Latitude" value={f.lat} onChange={set("lat")} required />
            <input className="field" inputMode="decimal" placeholder="Longitude" value={f.lng} onChange={set("lng")} required />
          </div>
          <p className="text-xs muted">Exact location: open your futsal in Google Maps, right-click the spot, and click the coordinates to copy them.</p>
        </>}
      </>}
      <input className="field" type="email" placeholder="Email" value={f.email} onChange={set("email")} required />
      <input className="field" type="password" placeholder="Password" value={f.password} onChange={set("password")} required />
      {reg && (
        <ul className="space-y-1 text-xs" aria-label="Password rules">
          {passwordRules.map((r) => (
            <li key={r.label} className={r.test(f.password) ? "text-green-400" : "muted"}>{r.test(f.password) ? "✓" : "•"} {r.label}</li>
          ))}
        </ul>
      )}
      {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
      <button className="btn w-full">{reg ? "Sign up" : "Log in"}</button>
      <button type="button" className="w-full text-sm underline" onClick={() => { setErr(""); setMode(reg ? "login" : "register"); }}>
        {reg ? "Have an account? Log in" : "New here? Create an account"}
      </button>
    </form>
  );
}