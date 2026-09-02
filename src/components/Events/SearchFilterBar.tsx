import { Input } from "@/components/ui/input";
import { SearchRightIcon } from "@/assets/icons";
 
interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}
 
export default function SearchFilterBar({ search, onSearchChange }: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 mb-6">
      <Input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        leadingIcon={<SearchRightIcon className="w-5 h-5 text-neutral-400" />}
        className="w-full"
        style={{ flexGrow: 797, flexShrink: 1, flexBasis: 0 }}
      />
      <select
        className="w-full bg-neutral-925 text-sm text-white rounded-[10px] border border-neutral-925 px-3 py-2 appearance-none"
        style={{ flexGrow: 313.5, flexShrink: 1, flexBasis: 0 }}
      >
        <option>All Categories</option>
      </select>
      <select
        className="w-full bg-neutral-925 text-sm text-white rounded-[10px] border border-neutral-925 px-3 py-2 appearance-none"
        style={{ flexGrow: 313.5, flexShrink: 1, flexBasis: 0 }}
      >
        <option>All Status</option>
      </select>
    </div>
  );
}