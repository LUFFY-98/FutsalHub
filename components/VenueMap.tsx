"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapVenue = { id: number; name: string; lat: number; lng: number; distance: number | null };
type Loc = { latitude: number; longitude: number } | null;

function Recenter({ loc, single }: { loc: Loc; single?: MapVenue }) {
  const map = useMap();
  useEffect(() => {
    if (loc) map.setView([loc.latitude, loc.longitude], 14);
    else if (single) map.setView([single.lat, single.lng], 15);
  }, [loc, single, map]);
  return null;
}
const pin = (color: string) => L.divIcon({
  className: "", iconSize: [22, 22], iconAnchor: [11, 11],
  html: `<div style="width:22px;height:22px;background:${color};border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,.5)"></div>`,
});
const userIcon = pin("#2563eb");
const venueIcon = pin("#f36b21");

export default function VenueMap({ userLocation = null, venues, height = 450 }: { userLocation?: Loc; venues: MapVenue[]; height?: number }) {
  // Create the map only after mount; avoids Leaflet "appendChild" crash when React remounts in dev.
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); return () => setReady(false); }, []);
  if (!ready) return <div className="card" style={{ height }} />;
  return (
    <MapContainer center={[27.7172, 85.324]} zoom={12} scrollWheelZoom style={{ height, width: "100%", borderRadius: 16 }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter loc={userLocation} single={venues.length === 1 ? venues[0] : undefined} />
      {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}><Popup>You are here</Popup></Marker>}
      {venues.map((v) => (
        <Marker key={v.id} position={[v.lat, v.lng]} icon={venueIcon}>
          <Popup>
            <strong>{v.name}</strong><br />
            {v.distance !== null ? `${v.distance.toFixed(2)} km away` : "Distance unavailable"}<br />
            <a href={`/futsals/${v.id}`}>View and book</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}