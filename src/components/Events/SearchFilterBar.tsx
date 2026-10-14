import { Input } from "@/components/ui/input";
import { SearchRightIcon } from "@/assets/icons";
import { ChevronDown } from "lucide-react";

interface SearchFilterBarProps {
      search: string;
      onSearchChange: (value: string) => void;
      categories: string[];
      statuses: string[];
      category: string;
      onCategoryChange: (value: string) => void;
      status: string;
      onStatusChange: (value: string) => void;
}

export default function SearchFilterBar({
      search,
      onSearchChange,
      categories,
      statuses,
      category,
      onCategoryChange,
      status,
      onStatusChange,
}: SearchFilterBarProps) {
      return (
            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,2.55fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center">
                  <Input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        leadingIcon={<SearchRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}
                        className="h-8 w-full min-w-0 rounded-lg border-neutral-925 bg-neutral-925 px-3 py-0 text-xs"
                  />
                  <label className="relative w-full min-w-0">
                        <span className="sr-only">Filter by category</span>
                        <select
                              value={category}
                              onChange={(event) => onCategoryChange(event.target.value)}
                              className="h-8 w-full appearance-none rounded-lg border border-neutral-925 bg-neutral-925 px-3 pr-9 text-xs text-neutral-300 outline-none transition-colors hover:border-neutral-700 focus:border-purple-500"
                        >
                              <option value="all">All Categories</option>
                              {categories.map((value) => (
                                    <option key={value} value={value}>
                                          {value}
                                    </option>
                              ))}
                        </select>
                        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  </label>
                  <label className="relative w-full min-w-0">
                        <span className="sr-only">Filter by status</span>
                        <select
                              value={status}
                              onChange={(event) => onStatusChange(event.target.value)}
                              className="h-8 w-full appearance-none rounded-lg border border-neutral-925 bg-neutral-925 px-3 pr-9 text-xs text-neutral-300 outline-none transition-colors hover:border-neutral-700 focus:border-purple-500"
                        >
                              <option value="all">All Status</option>
                              {statuses.map((value) => (
                                    <option key={value} value={value}>
                                          {value}
                                    </option>
                              ))}
                        </select>
                        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  </label>
            </div>
      );
}
