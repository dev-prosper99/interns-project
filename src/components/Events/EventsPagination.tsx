import { cn } from "@/lib/utils";

type EventsPaginationProps = {
  className?: string;
};

export default function EventsPagination({ className }: EventsPaginationProps) {
  return (
    <div
      className={cn(
        "mt-4 flex flex-col items-center gap-3 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <span>Page 1 of 1</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800">
          Prev
        </button>
        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white">
          1
        </button>
        <button className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800">
          Next
        </button>
      </div>
      <span>Page Size: 10</span>
    </div>
  );
}
