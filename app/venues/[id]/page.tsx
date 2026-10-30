
import Image from "next/image";
import Link from "next/link";
import { venues } from "../../data/venues";

type VenueDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VenueDetails({
  params,
}: VenueDetailsProps) {
  const { id } = await params;

  const venue = venues.find(
    (item) => item.id === Number(id)
  );

  if (!venue) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6 text-white">
        <div className="text-center">
          <p className="mb-3 text-5xl">⚽</p>
          <h1 className="text-3xl font-black">
            Venue not found
          </h1>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-semibold text-orange-500 transition hover:text-orange-400"
        >
          ← Back to home
        </Link>

        {/* Venue Image */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#1c1c1c]">
          <div className="relative h-72 md:h-[450px]">
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6">
              <span className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white">
                {venue.tag}
              </span>

              <h1 className="mt-4 text-3xl font-black md:text-5xl">
                {venue.name}
              </h1>

              <p className="mt-2 text-gray-200">
                📍 {venue.location}
              </p>
            </div>
          </div>

          {/* Venue Information */}
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
                Venue Information
              </p>

              <h2 className="mt-3 text-2xl font-black">
                About this venue
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                Explore this futsal venue and check its location
                and listed hourly price before planning your next
                match.
              </p>

              <div className="mt-7">
                <p className="text-sm text-gray-400">
                  Listed price
                </p>

                <p className="mt-2 text-3xl font-black text-orange-500">
                  Rs. {venue.price.toLocaleString("en-IN")}
                  <span className="ml-1 text-base font-medium text-gray-400">
                    / hour
                  </span>
                </p>
              </div>
            </div>

            {/* Location Details */}
            <div className="rounded-2xl border border-white/10 bg-[#242424] p-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <h2 className="text-xl font-bold">
                  Venue Location
                </h2>
              </div>

              <p className="mt-5 text-sm text-gray-400">
                Address
              </p>

              <p className="mt-1 font-semibold">
                {venue.location}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-gray-400">
                  Coordinates
                </p>

                <p className="mt-3 text-sm text-gray-300">
                  Latitude: {venue.latitude}
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  Longitude: {venue.longitude}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 sm:flex-row">
          <div>
            <h3 className="text-lg font-bold">
              Ready for your next match?
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Explore more futsal venues.
            </p>
          </div>

          <Link
            href="/#venues"
            className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore more venues →
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Sample venue information. Prices and details should be verified.
        </p>
      </div>
    </main>
  );
}
