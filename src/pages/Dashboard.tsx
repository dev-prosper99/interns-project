import { Navigate } from "react-router-dom";
import AdminDashboard from "@/components/DashBoard/AdminDashboard/AdminDashboard";
import AttendeeDashboard from "@/components/DashBoard/AttendeeDashboard/AttendeeDashboard";

const DashBoard = () => {
      const role = localStorage.getItem("role")?.trim().toLowerCase();

      if (role === "attendee") {
            return <AttendeeDashboard />;
      }

      if (role === "organizer") {
            return <AdminDashboard />;
      }

      return <Navigate to="/login" replace />;
};

export default DashBoard;
