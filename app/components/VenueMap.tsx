
"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Venue = {
  name: string;
  latitude: number;
  longitude: number;
  distance: number | null;
};

type VenueMapProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  venues: Venue[];
};

function LocationUpdater({
  userLocation,
}: {
  userLocation: VenueMapProps["userLocation"];
}) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(
        [userLocation.latitude, userLocation.longitude],
        14
      );
    }
  }, [userLocation, map]);

  return null;
}

// Blue marker for the user's location
const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #2563eb;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(0,0,0,0.5);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function VenueMap({
  userLocation,
  venues,
}: VenueMapProps) {
  return (
    <MapContainer
      center={[27.7172, 85.324]}
      zoom={12}
      scrollWheelZoom={true}
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationUpdater userLocation={userLocation} />

      {/* User's location marker */}
      {userLocation && (
        <Marker
          position={[
            userLocation.latitude,
            userLocation.longitude,
          ]}
          icon={userIcon}
        >
          <Popup>You are here!</Popup>
        </Marker>
      )}

      {/* Venue markers */}
      {venues.map((venue) => (
        <Marker
          key={venue.name}
          position={[venue.latitude, venue.longitude]}
        >
          <Popup>
            <strong>{venue.name}</strong>
            <br />
            {venue.distance !== null
              ? `${venue.distance.toFixed(2)} km away`
              : "Distance unavailable"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
