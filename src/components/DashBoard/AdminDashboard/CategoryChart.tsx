const categorySales = [
  {
    category: "Music",
    tickets: 500,
    percentage: 75,
    color: "bg-purple-500",
  },
  {
    category: "Tech",
    tickets: 400,
    percentage: 68,
    color: "bg-orange-500",
  },
  {
    category: "Business",
    tickets: 250,
    percentage: 55,
    color: "bg-blue-800",
  },
  {
    category: "Sports",
    tickets: 200,
    percentage: 42,
    color: "bg-green-500",
  },
  {
    category: "Art",
    tickets: 150,
    percentage: 28,
    color: "bg-yellow-5 00",
  },
];
const CategoryChart = () => {
    return (
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6 h-full flex flex-col">
  <h2 className="text-2xl font-semibold text-white mb-8">
    Sales by Category (Top 5)
  </h2>
 
  <div className="space-y-8 flex-1 overflow-auto">
    {categorySales.map((item) => (
      <div key={item.category}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">
            {item.category}
          </span>
 
          <span className="text-white font-semibold">
            {item.tickets} tickets
          </span>
        </div>
 
        <div className="w-full h-3 bg-[#3A3A3A] rounded-full overflow-hidden">
          <div
            className={`${item.color} h-full rounded-full transition-all duration-500`}
            style={{ width: `${item.percentage}%` }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
    );
}
export default CategoryChart;