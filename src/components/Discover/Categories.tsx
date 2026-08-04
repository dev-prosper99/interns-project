const filterCategories = [
  { label: "All Categories", value: "all" },
  { label: "Music", value: "music" },
  { label: "Tech", value: "tech" },
  { label: "Comedy", value: "comedy" },
  { label: "Sports", value: "sports" },
  { label: "Art", value: "art" },
  { label: "Food", value: "food" },
  { label: "Fashion", value: "fashion" },
  { label: "Wellness", value: "wellness" },
  { label: "Culture", value: "culture" },
  { label: "Business", value: "business" },
  { label: "Gaming", value: "gaming" },
];
const Categories = () => {
  return (
    <div className="flex flex-wrap gap-2 h-[1866px] bg-black/90">
      <div className="gap-2 h-20 space-y-6 mx-4 mt-4">
        <p className="text-white text-xl font-medium ">Categories </p>
        {filterCategories.map((category) => (
          <button
            key={category.value}
            className="  border-gray-700 rounded-[10px] m-2 radius-10px p-2  text-white  border-2 hover:bg-purple-500/10 hover:text-purple-500 focus-visible:border-[1.5px] focus-visible:border-purple-500/24 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:border-neutral-800"
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
