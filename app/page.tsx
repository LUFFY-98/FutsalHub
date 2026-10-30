
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { venues } from "./data/venues";
import { useTheme } from "./components/ThemeProvider";

const VenueMap = dynamic(() => import("./components/VenueMap"), {
  ssr: false,
});

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const earthRadius = 6371;

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [maxDistance, setMaxDistance] = useState("any");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationMessage, setLocationMessage] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.");
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
          setLocationMessage("Your location is currently unavailable.");
        } else {
          setLocationMessage("Unable to detect your location. Try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.location.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedVenues = filteredVenues
    .map((venue) => ({
      ...venue,
      distance: userLocation
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            venue.latitude,
            venue.longitude,
          )
        : null,
    }))
    .filter((venue) => {
      if (!userLocation || maxDistance === "any") {
        return true;
      }

      return venue.distance !== null && venue.distance <= Number(maxDistance);
    })
    .sort((a, b) => {
      if (a.distance === null || b.distance === null) {
        return 0;
      }

      return a.distance - b.distance;
    });

  const dark = theme === "dark";

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-[#111111] text-white"
          : "bg-[#f5f5f5] text-[#171717]"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between border-b px-6 py-5 backdrop-blur-md md:px-16 ${
          dark
            ? "border-white/10 bg-[#151515]/95"
            : "border-gray-200 bg-white/95"
        }`}
      >
        <a href="#home" className="text-2xl font-black tracking-tight">
          Futsal<span className="text-orange-500">Hub.</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#home" className="transition hover:text-orange-500">
            Home
          </a>

          <a href="#venues" className="transition hover:text-orange-500">
            Explore venues
          </a>

          <a href="#about" className="transition hover:text-orange-500">
            About us
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
              dark
                ? "border-white/20 hover:border-orange-500"
                : "border-gray-300 hover:border-orange-500"
            }`}
            aria-label="Toggle color theme"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <a
            href="#venues"
            className="hidden rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:inline-flex"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-16 md:py-28"
      >
        <div>
          <p className="mb-5 inline-flex rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
            YOUR GAME. YOUR COURT.
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Find your next
            <span className="block text-orange-500">futsal match.</span>
          </h1>

          <p
            className={`mt-6 max-w-lg text-lg leading-8 ${
              dark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover futsal venues around you and get ready for your next
            match. Your next game starts here.
          </p>

          <a
            href="#venues"
            className="mt-8 inline-flex rounded-full bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore courts <span className="ml-3">→</span>
          </a>

          <div className="mt-10 flex gap-8">
            <div>
              <p className="text-2xl font-black">Easy</p>
              <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Court discovery
              </p>
            </div>

            <div>
              <p className="text-2xl font-black">Fast</p>
              <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Booking process
              </p>
            </div>

            <div>
              <p className="text-2xl font-black">Local</p>
              <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Futsal venues
              </p>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem] bg-[#1c1c1c] p-8 md:min-h-[440px]">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-orange-600/20 blur-3xl" />

          <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/5 p-6 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">MATCH DAY</span>

              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                LET'S PLAY
              </span>
            </div>

            <div className="my-10 text-center">
              <div className="text-7xl">⚽</div>
              <h2 className="mt-5 text-3xl font-black">GAME ON.</h2>
              <p className="mt-2 text-sm text-gray-300">
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
      <section
        id="venues"
        className={`px-6 py-20 md:px-16 ${
          dark ? "bg-[#191919]" : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold uppercase tracking-widest text-orange-500">
                Find your next match
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Explore futsal venues
              </h2>

              <p className={`mt-3 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                Find a court for your next game.
              </p>
            </div>

            <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
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
              className={`w-full rounded-xl border px-5 py-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                dark
                  ? "border-white/10 bg-[#242424] text-white placeholder:text-gray-500"
                  : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              }`}
            />

            <button
              type="button"
              onClick={getUserLocation}
              disabled={loadingLocation}
              className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {loadingLocation ? "Detecting location..." : "📍 Use my location"}
            </button>

            {locationMessage && (
              <p
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                role="status"
              >
                {locationMessage}
              </p>
            )}

            {userLocation && (
              <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-500"}`}>
                Latitude: {userLocation.latitude.toFixed(5)}, Longitude:{" "}
                {userLocation.longitude.toFixed(5)}
              </p>
            )}

            {/* Distance Filter */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="distance-filter"
                className={dark ? "font-semibold text-gray-300" : "font-semibold text-gray-700"}
              >
                Search within:
              </label>

              <select
                id="distance-filter"
                value={maxDistance}
                onChange={(event) => setMaxDistance(event.target.value)}
                className={`rounded-xl border px-4 py-3 outline-none focus:border-orange-500 ${
                  dark
                    ? "border-white/10 bg-[#242424] text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              >
                <option value="any">Any distance</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
              </select>

              {!userLocation && (
                <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
                  Detect your location to use the distance filter.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="mt-12">
            <h3 className="mb-5 text-2xl font-bold">
              Find venues on the map
            </h3>

            <VenueMap
              userLocation={userLocation}
              venues={displayedVenues}
            />
          </div>

          {/* Venue Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {displayedVenues.map((venue) => (
              <article
                key={venue.name}
                className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                  dark
                    ? "border-white/10 bg-[#222222] hover:border-orange-500/50"
                    : "border-gray-200 bg-white hover:border-orange-300"
                }`}
              >
                <div className="h-44 overflow-hidden rounded-xl">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    width={500}
                    height={300}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">{venue.name}</h3>

                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
                    {venue.tag}
                  </span>
                </div>

                <p className={`mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  📍 {venue.location}
                </p>

                {venue.distance !== null && (
                  <p className="mt-2 text-sm font-semibold text-orange-500">
                    📍 Approximately {venue.distance.toFixed(2)} km away
                  </p>
                )}

                <div className={`mt-5 flex items-center justify-between border-t pt-4 ${
                  dark ? "border-white/10" : "border-gray-100"
                }`}>
                  <span className="text-sm font-bold">
                    Rs. {venue.price.toLocaleString("en-IN")} / hour
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href = `/venues/${venue.id}`)
                    }
                    className="rounded-full border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>

          {displayedVenues.length === 0 && (
            <p className={`mt-8 text-center ${dark ? "text-gray-400" : "text-gray-500"}`}>
              No venues found within this distance. Try increasing your search
              radius.
            </p>
          )}

          <p className={`mt-6 text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
            Note: venue details, prices and coordinates are sample listings for
            the design preview and should be verified before use.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="bg-[#111111] px-6 py-10 text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xl font-black">
            Futsal<span className="text-orange-500">Hub.</span>
          </p>

          <p className="text-sm text-gray-300">
            Built for the love of the game. ⚽
          </p>

          <p className="text-sm text-gray-400">© 2026 FutsalHub</p>
        </div>
      </footer>
    </main>
  );
}
