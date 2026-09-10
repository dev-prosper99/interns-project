import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/authentication/SignUp";
import Login from "./pages/authentication/Login";
import ProtectedRoute from "./ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Events from "./components/Events/Events";
import DiscoverEventsDetails from "./components/Dashboard/AttendeeDashboard/Sections/DiscoverEventsSections/DiscoverEventsDetails";
import Analytics from "./components/Dashboard/AdminDashboard/AdminDashboardPages/Analytics/AnalyticsPage";
import TicketsPage from "./components/Dashboard/AdminDashboard/AdminDashboardPages/Tickets/TicketsPage";
import MyTickets from "./components/Dashboard/AttendeeDashboard/AttendeeDashboardPages/MyTickets";
import DiscoverEvents from "./components/Dashboard/AttendeeDashboard/AttendeeDashboardPages/DiscoverEvents";
import SavedEvents from "./components/Dashboard/AttendeeDashboard/AttendeeDashboardPages/SavedEvents";
import Settings from "./components/Dashboard/AttendeeDashboard/AttendeeDashboardPages/Settings";
import { TransactionsPage } from "./components/Dashboard/AdminDashboard/AdminDashboardPages/Trasanctions";
import AccountSettingsPage from "./components/Dashboard/AdminDashboard/AdminDashboardPages/Profile/AccountSettingsPage ";
import AttendeesPage from "./components/Dashboard/AdminDashboard/AdminDashboardPages/Atendee/Attendees";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/events" element={<Events />} />
          <Route path="/discover-events" element={<DiscoverEvents />} />
          <Route
            path="/discover-events/:title"
            element={<DiscoverEventsDetails />}
          />
          <Route path="/saved-events" element={<SavedEvents />} />
          <Route path="/my-settings" element={<Settings />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/attendees" element={<AttendeesPage />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
