import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/Authentication/SignUp";
import Login from "./pages/Authentication/Login";
import Analytics from "./components/DashBoard/AdminDashboard/Analytics/AnalyticsPage";
import ProtectedRoute from "./ProtectedRoutes";
import TransactionsPage from "./components/DashBoard/AdminDashboard/Trasanctions/TransactionsPage";
import AccountSettingsPage from "./components/DashBoard/AdminDashboard/Profile/AccountSettingsPage ";

import Dashboard from "./pages/Dashboard";
import TicketsPage from "./components/DashBoard/AdminDashboard/Tickets/TicketsPage";
import AttendeesPage from "./components/DashBoard/AdminDashboard/Atendee/Attendees";
import Events from "./components/Events/Events";
import AttendeDashboard from "./components/DashBoard/AttendeeDashboard/AttendeDashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/attendees" element={<AttendeesPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/attendee-dashboard" element={<AttendeDashboard />} />
        </Route>

        <Route path="/" element={<Home />} />

        <Route path="/discover" element={<Discover />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
