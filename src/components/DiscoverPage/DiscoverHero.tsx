import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/assets/icons";
import Categories from "@/components/DiscoverPage/Categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filters = [
  {
    placeholder: "All Cities",
    options: ["Lagos", "Abuja", "Ibadan", "Port Harcourt"],
  },
  {
    placeholder: "All Prices",
    options: ["Free", "₦0 - ₦5,000", "₦5,000+"],
  },
  {
    placeholder: "This Week",
    options: ["Today", "Tomorrow", "This Week", "This Month"],
  },
];

const Discover = () => {
  return (
    <div className="h-full w-full ">
      <div className="h-[70vh] bg-[url('/src/assets/images/discover.png')] bg-center bg-cover">
        <div className="bg-black/70 w-full h-full flex flex-col items-center justify-center">
          <div className="space-y-6">
            <h1 className="lg:text-7xl text-4xl font-extrabold font-jakarta text-center text-white">
              Discover Events
            </h1>

            <p className="text-base font-medium text-center text-white">
              Find your next unforgettable experience
            </p>
          </div>

          <div className="mt-25 h-10 flex w-full  max-w-7xl flex-col items-center lg:flex-row justify-center gap-4">
            <div className="relative  w-full max-w-3xl lg:flex-1 bg-">
              <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search events..."
                className="h-10 rounded-xl border border-gray-200 text-black bg-white pl-12"
              />
            </div>

            {filters.map((filter) => (
              <Select key={filter.placeholder}>
                <SelectTrigger className=" h-10 rounded-xl bg-white text-gray-500 border border-gray-200 px-4 w-full max-w-56">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>

                <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg">
                  {filter.options.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="cursor-pointer rounded-md text-sm "
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      </div>

      <Categories />
    </div>
  );
};

export default Discover;
