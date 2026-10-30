"use client";
import { useState } from "react";
export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", password: "", role: "player", futsalName: "", address: "" });
  const [err, setErr] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ action: mode, ...f }) });
    const d = await r.json();
    if (!r.ok) return setErr(d.error);
    location.href = f.role === "owner" && mode === "register" ? "/owner" : "/";
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-3 rounded-lg bg-[var(--bar)] p-6">
      <h1 className="text-xl font-bold">{mode === "login" ? "Log in" : "Create account"}</h1>
      {mode === "register" && <>
        <input className="input" placeholder="Full name" value={f.name} onChange={set("name")} required />
        <select className="input" value={f.role} onChange={set("role")}>
          <option value="player">I want to book futsals</option><option value="owner">I own a futsal</option>
        </select>
        {f.role === "owner" && <>
          <input className="input" placeholder="Futsal name" value={f.futsalName} onChange={set("futsalName")} required />
          <input className="input" placeholder="Address" value={f.address} onChange={set("address")} />
        </>}
      </>}
      <input className="input" type="email" placeholder="Email" value={f.email} onChange={set("email")} required />
      <input className="input" type="password" placeholder="Password (6+ characters)" value={f.password} onChange={set("password")} required />
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <button className="btn w-full">{mode === "login" ? "Log in" : "Sign up"}</button>
      <button type="button" className="w-full text-sm underline" onClick={() => { setErr(""); setMode(mode === "login" ? "register" : "login"); }}>
        {mode === "login" ? "New here? Create an account" : "Have an account? Log in"}
      </button>
    </form>
  );
}
