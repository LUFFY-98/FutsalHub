import { Suspense } from "react";
import FutsalClient from "./FutsalClient";

// The [id] param is only known at request time, so it is read inside <Suspense>.
async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FutsalClient id={id} />;
}

export default function FutsalPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Content params={params} />
    </Suspense>
  );
}