"use client";
export default function LogoutButton() {
  return <button className="underline" onClick={async () => {
    await fetch("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) });
    location.href = "/";
  }}>Log out</button>;
}
