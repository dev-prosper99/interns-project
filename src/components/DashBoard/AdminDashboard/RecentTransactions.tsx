const RecentTransactions = () => {
  const transactions = [
    {
      id: 1,
      name: "Amara Okafor",
      event: "Afrobeats & Vibes Festival",
      tier: "VIP",
      amount: "₦90,000",
      status: "Completed"
    },
    {
      id: 2,
      name: "Emeka Nwosu",
      event: "TechFest West Africa",
      tier: "Regular",
      amount: "₦5,000",
      status: "Completed"
    },
    {
      id: 3,
      name: "Fatima Abdullahi",
      event: "Lagos Comedy Fiesta",
      tier: "VIP",
      amount: "₦25,000",
      status: "Completed"
    },
    {
      id: 4,
      name: "Amara Okafor",
      event: "Wellness Weekend",
      tier: "Free",
      amount: "₦0.00",
      status: "Completed"
    }
  ];
 
  return (
    <div className="bg-neutral-1000 p-6 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-semibold">Recent Transactions</h2>
        <a href="#" className="text-purple-500 text-sm hover:text-purple-400">View all</a>
      </div>
      
      <div className="space-y-6 flex-1 overflow-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-medium">{transaction.name}</h3>
              <p className="text-gray-400 text-sm">{transaction.event} - {transaction.tier}</p>
              <span className="inline-block mt-2 bg-green-900 text-green-400 text-xs px-2 py-1 rounded">
                {transaction.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{transaction.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RecentTransactions;
