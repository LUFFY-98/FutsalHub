
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const venues = [
  {
    name: "Dhuku Sports Hub",
    latitude: 27.7172,
    longitude: 85.324,
  },
  {
    name: "Bhaktapur Futsal",
    latitude: 27.671,
    longitude: 85.4298,
  },
  {
    name: "Pulchowk Sports Hub",
    latitude: 27.6766,
    longitude: 85.3188,
  },
];

export default function VenueMap() {
  return (
    <MapContainer
      center={[27.7172, 85.324]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "450px", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {venues.map((venue) => (
        <Marker
          key={venue.name}
          position={[venue.latitude, venue.longitude]}
        >
          <Popup>
            <strong>{venue.name}</strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
