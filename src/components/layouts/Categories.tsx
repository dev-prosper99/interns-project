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
        <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => (
                <button
                    key={category.value}
                      
                    ></button>

            ))}
        </div>
    );
}
export default Categories;