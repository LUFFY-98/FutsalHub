import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { q } from "@/lib/db";
import OwnerPanel from "@/components/OwnerPanel";

export const dynamic = "force-dynamic";
export default async function Owner() {
  const u = await getUser();
  if (!u || u.role !== "owner") redirect("/login");
  const f = (await q("SELECT id,name,lat,lng FROM futsals WHERE owner_id=? LIMIT 1", [u.id]))[0];
  if (!f) return <p>No futsal found for this account.</p>;
  return <OwnerPanel futsal={f} />;
}
