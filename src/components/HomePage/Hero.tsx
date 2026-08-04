import { SearchIcon } from "@/assets/icons";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-cover bg-center flex flex-col  items-center justify-center text-center bg-[url('/src/assets/hero-bg.png')]">
      <div className="pt-20 pb-12 sm:pb-20 px:6 min-h-screen z-10 w-full h-full flex flex-col items-center justify-center gap-6 px-4 md:px-0 bg-linear-to-b from-[rgba(63,15,145,0.48)] to-[rgba(16,2,39,0.8)]">
        {/* Badge */}
        <div className=" flex items-center gap-2 border border-neutral-400 rounded-full px-3 py-3 text-neutral-50 text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <p>Over 14,000 events live across Nigeria</p>
        </div>

        <div className="max-w-310 flex flex-col gap-6 items-center justify-center">
          <h1 className="font-jakarta text-white text-4xl lg:text-6xl font-extrabold leading-11 lg:leading-19.75">
            Every Event Deserves a Full House.
          </h1>

          <p className="text-neutral-50 text-lg text-center max-w-285 font-medium leading-7">
            Discover, attend, and manage unforgettable events across Nigeria.
            From stadium concerts to intimate workshops — TixO is where it all
            begins.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-between w-full max-w-153.25 bg-neutral-100 rounded-[10px] py-3 px-4">
          <div className="flex items-center gap-2 flex-1">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-[10px] py-2 px-6">
            Search
          </button>
        </div>

        {/* Popular categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-white text-sm self-center mr-1">Popular:</span>
          {["Tech", "Comedy", "Music", "Comedy", "Sports"].map((cat, i) => (
            <span
              key={i}
              className="bg-white/10 text-white text-xs px-4 py-1.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
