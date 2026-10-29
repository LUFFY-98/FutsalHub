
"use client";

import { useState } from "react";

const venues = [
  {
    name: "Dhuku Sports Hub",
    location: "Kathmandu, Nepal",
    price: "Rs. 1,800 / hour",
    tag: "Popular",
  },
  {
    name: "Bhaktapur Futsal",
    location: "Suryabinayak, Bhaktapur",
    price: "Rs. 2,000 / hour",
    tag: "Local venue",
  },
  {
    name: "Pulchowk Sports Hub",
    location: "Pulchowk, Lalitpur",
    price: "From Rs. 1,500 / hour",
    tag: "Explore",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17251c]">
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
            <span className="block text-green-700">futsal match.</span>
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
              <p className="mt-1 text-sm text-gray-500">Court discovery</p>
            </div>
            <div>
              <p className="text-2xl font-black">Fast</p>
              <p className="mt-1 text-sm text-gray-500">Booking process</p>
            </div>
            <div>
              <p className="text-2xl font-black">Local</p>
              <p className="mt-1 text-sm text-gray-500">Futsal venues</p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[2rem] bg-green-900 p-8 md:min-h-[440px]">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-green-400/20 blur-3xl" />

          <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-100">MATCH DAY</span>
              <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-green-950">
                LET'S PLAY
              </span>
            </div>

            <div className="my-10 text-center">
              <div className="text-7xl">⚽</div>
              <h2 className="mt-5 text-3xl font-black">GAME ON.</h2>
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
            <span className="text-sm text-gray-500">Kathmandu Valley</span>
          </div>

          <div className="mt-8">
            <input
              type="search"
              aria-label="Search futsal venues"
              placeholder="Search by venue or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {filteredVenues.map((venue) => (
              <article
                key={venue.name}
                className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-44 overflow-hidden rounded-xl">
                  <img
                    src={
                      venue.name === "Dhuku Sports Hub"
                        ? "/venues/1.jpg"
                        : venue.name === "Bhaktapur Futsal"
                          ? "/venues/2.jpg"
                          : "/venues/3.jpg"
                    }
                    alt={venue.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">{venue.name}</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    {venue.tag}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  📍 {venue.location}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-bold">{venue.price}</span>
                  <button
                    type="button"
                    className="rounded-full border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-700 hover:text-white"
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <p className="mt-8 text-center text-gray-500">
              No venues found. Try another name or location.
            </p>
          )}

          <p className="mt-6 text-sm text-gray-500">
            Note: venue details and prices are sample listings for the design
            preview and should be verified before use.
          </p>
        </div>
      </section>

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
          <p className="text-sm text-gray-400">© 2026 FutsalHub</p>
        </div>
      </footer>
    </main>
  );
}
