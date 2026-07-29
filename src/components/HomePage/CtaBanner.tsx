export default function CtaBanner() {
  return (
    <div
      className="relative h-100 bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: `url(/src/assets/backview.jpg)` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h2 className="text-white text-3xl font-bold">
          Ready to create your first event?
        </h2>
        <p className="text-neutral-200 text-sm">
          Join thousands of event organizers already selling tickets with TixO
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-purple-600 hover:bg-[#6D28D9] text-white px-6 py-3 rounded-lg font-medium">
            Get Started
          </button>
          <button className="bg-neutral-500 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium border border-white/30">
            Discover Events
          </button>
        </div>
      </div>
    </div>
  );
}