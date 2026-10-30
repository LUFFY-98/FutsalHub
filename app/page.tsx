
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const VenueMap = dynamic(
  () => import("./components/VenueMap"),
  { ssr: false }
);

const venues = [
  {
    name: "Dhuku Sports Hub",
    location: "Kathmandu, Nepal",
    price: "Rs. 1,800 / hour",
    tag: "Popular",
    latitude: 27.7172,
    longitude: 85.324,
  },
  {
    name: "Bhaktapur Futsal",
    location: "Suryabinayak, Bhaktapur",
    price: "Rs. 2,000 / hour",
    tag: "Local venue",
    latitude: 27.671,
    longitude: 85.4298,
  },
  {
    name: "Pulchowk Sports Hub",
    location: "Pulchowk, Lalitpur",
    price: "From Rs. 1,500 / hour",
    tag: "Explore",
    latitude: 27.6766,
    longitude: 85.3188,
  },
];

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadius = 6371;

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export default function Home() {
  const [search, setSearch] = useState("");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationMessage, setLocationMessage] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLoadingLocation(true);
    setLocationMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage("Location detected successfully!");
        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage("Location permission was denied.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationMessage(
            "Your location is currently unavailable."
          );
        } else {
          setLocationMessage(
            "Unable to detect your location. Try again."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Search venues by name or location
  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.location.toLowerCase().includes(search.toLowerCase())
  );

  // Sort venues from nearest to farthest
  const displayedVenues = userLocation
    ? [...filteredVenues].sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );

        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );

        return distanceA - distanceB;
      })
    : filteredVenues;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17251c]">

      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 md:px-16">
        <a href="#" className="text-2xl font-black tracking-tight">
          Futsal<span className="text-green-600">Hub.</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#home" className="hover:text-green-600">
            Home
          </a>

          <a href="#venues" className="hover:text-green-600">
            Explore venues
          </a>

          <a href="#about" className="hover:text-green-600">
            About us
          </a>
        </div>

        <a
          href="#venues"
          className="rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          Get started
        </a>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-16 md:py-28"
      >
        <div>
          <p className="mb-5 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            YOUR GAME. YOUR COURT.
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Find your next
            <span className="block text-green-700">
              futsal match.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Discover futsal venues around you and get ready for your next match.
            Your next game starts here.
          </p>

          <a
            href="#venues"
            className="mt-8 inline-flex rounded-full bg-green-700 px-7 py-4 font-semibold text-white transition hover:bg-green-800"
          >
            Explore courts <span className="ml-3">→</span>
          </a>

          <div className="mt-10 flex gap-8">
            <div>
              <p className="text-2xl font-black">Easy</p>
              <p className="mt-1 text-sm text-gray-500">
                Court discovery
              </p>
            </div>

            <div>
              <p className="text-2xl font-black">Fast</p>
              <p className="mt-1 text-sm text-gray-500">
                Booking process
              </p>
            </div>

            <div>
              <p className="text-2xl font-black">Local</p>
              <p className="mt-1 text-sm text-gray-500">
                Futsal venues
              </p>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem] bg-green-900 p-8 md:min-h-[440px]">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-green-400/20 blur-3xl" />

          <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-100">
                MATCH DAY
              </span>

              <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-green-950">
                LET'S PLAY
              </span>
            </div>

            <div className="my-10 text-center">
              <div className="text-7xl">⚽</div>
              <h2 className="mt-5 text-3xl font-black">
                GAME ON.
              </h2>
              <p className="mt-2 text-sm text-green-100">
                Your next match is waiting.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/20 pt-4 text-sm">
              <span>Find a venue</span>
              <span>Book your slot →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section id="venues" className="bg-white px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold uppercase tracking-widest text-green-700">
                Find your next match
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Explore futsal venues
              </h2>

              <p className="mt-3 text-gray-600">
                Find a court for your next game.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              Kathmandu Valley
            </span>
          </div>

          {/* Search and Location */}
          <div className="mt-8 space-y-4">
            <input
              type="search"
              aria-label="Search futsal venues"
              placeholder="Search by venue or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
              type="button"
              onClick={getUserLocation}
              disabled={loadingLocation}
              className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              {loadingLocation
                ? "Detecting location..."
                : "📍 Use my location"}
            </button>

            {locationMessage && (
              <p className="text-sm text-gray-600" role="status">
                {locationMessage}
              </p>
            )}

            {userLocation && (
              <p className="text-xs text-gray-500">
                Latitude: {userLocation.latitude.toFixed(5)},
                Longitude: {userLocation.longitude.toFixed(5)}
              </p>
            )}
          </div>

          {/* Interactive Map */}
          <div className="mt-12">
            <h3 className="mb-5 text-2xl font-bold">
              Find venues on the map
            </h3>

            <VenueMap />
          </div>

          {/* Venue Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {displayedVenues.map((venue) => {
              const distance = userLocation
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    venue.latitude,
                    venue.longitude
                  )
                : null;

              return (
                <article
                  key={venue.name}
                  className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-44 overflow-hidden rounded-xl">
                    <Image
                      src={
                        venue.name === "Dhuku Sports Hub"
                          ? "/venues/1.jpg"
                          : venue.name === "Bhaktapur Futsal"
                            ? "/venues/2.jpg"
                            : "/venues/3.jpg"
                      }
                      alt={venue.name}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold">
                      {venue.name}
                    </h3>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {venue.tag}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    📍 {venue.location}
                  </p>

                  {distance !== null && (
                    <p className="mt-2 text-sm font-semibold text-green-700">
                      📍 Approximately {distance.toFixed(2)} km away
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-bold">
                      {venue.price}
                    </span>

                    <button
                      type="button"
                      className="rounded-full border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-700 hover:text-white"
                    >
                      View details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredVenues.length === 0 && (
            <p className="mt-8 text-center text-gray-500">
              No venues found. Try another name or location.
            </p>
          )}

          <p className="mt-6 text-sm text-gray-500">
            Note: venue details, prices and coordinates are sample
            listings for the design preview and should be verified
            before use.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="bg-[#14251b] px-6 py-10 text-white md:px-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xl font-black">
            Futsal<span className="text-lime-400">Hub.</span>
          </p>

          <p className="text-sm text-gray-300">
            Built for the love of the game. ⚽
          </p>

          <p className="text-sm text-gray-400">
            © 2026 FutsalHub
          </p>
        </div>
      </footer>

    </main>
  );
}
