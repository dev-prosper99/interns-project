import Sidebar from "@/components/layouts/Sidebar";

const Dashboard = () => {
  return (
    <div className="">
      <Sidebar />
      

      <div className="flex-1 p-6 bg-neutral-1000">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-neutral-400">
          Welcome to your dashboard!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;