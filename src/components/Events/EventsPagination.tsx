export default function EventsPagination() {
  return (
    <div className="flex flex-col gap-3 items-center md:flex-row md:items-center md:justify-between mt-4 text-xs text-neutral-500">
      <span>Page 1 of 1</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800">
          Prev
        </button>
        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">1</button>
        <button className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800">
          Next
        </button>
      </div>
      <span>Page Size: 10</span>
    </div>
  );
}