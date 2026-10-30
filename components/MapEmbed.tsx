export default function MapEmbed({ q, className = "h-64" }: { q: string; className?: string }) {
  return <iframe title="Map" loading="lazy" className={`w-full rounded-lg border-0 ${className}`}
    src={`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`} />;
}
