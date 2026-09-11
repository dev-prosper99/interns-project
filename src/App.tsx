import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/authentication/SignUp";
import Login from "./pages/authentication/Login";
import ProtectedRoute from "./ProtectedRoutes";
import Events from "./components/Events/Events";
import DiscoverEventsDetails from "./components/DashBoard/AttendeeDashboard/Sections/DiscoverEventsSections/DiscoverEventsDetails";
import Analytics from "./components/DashBoard/AdminDashboard/AdminDashboardPages/Analytics/AnalyticsPage";
import TicketsPage from "./components/DashBoard/AdminDashboard/AdminDashboardPages/Tickets/TicketsPage";
import MyTickets from "./components/DashBoard/AttendeeDashboard/AttendeeDashboardPages/MyTickets";
import DiscoverEvents from "./components/DashBoard/AttendeeDashboard/AttendeeDashboardPages/DiscoverEvents";
import SavedEvents from "./components/DashBoard/AttendeeDashboard/AttendeeDashboardPages/SavedEvents";
import Settings from "./components/DashBoard/AttendeeDashboard/AttendeeDashboardPages/Settings";
import { TransactionsPage } from "./components/DashBoard/AdminDashboard/AdminDashboardPages/Trasanctions";
import AccountSettingsPage from "./components/DashBoard/AdminDashboard/AdminDashboardPages/Profile/AccountSettingsPage ";
import AttendeesPage from "./components/DashBoard/AdminDashboard/AdminDashboardPages/Atendee/Attendees";
import AttendeeDashboard from "@/pages/AttendeeDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

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
                        <Route path="/dashboard/attendee/events/:title" element={<DiscoverEventsDetails />} />

                        <Route element={<ProtectedRoute />}>
                              <Route path="/dashboard/attendee" element={<AttendeeDashboard />} />
                              <Route path="/dashboard/attendee/tickets" element={<MyTickets />} />
                              <Route path="/dashboard/attendee/events" element={<DiscoverEvents />} />
                              <Route path="/dashboard/attendee/settings" element={<Settings />} />
                              <Route path="/dashboard/attendee/saved-events" element={<SavedEvents />} />
                              <Route path="/dashboard/organizer" element={<AdminDashboard />} />
                              <Route path="/dashboard/organizer/analytics" element={<Analytics />} />
                              <Route path="/dashboard/organizer/tickets" element={<TicketsPage />} />
                              <Route path="/dashboard/organizer/events" element={<Events />} />
                              <Route path="/dashboard/organizer/settings" element={<AccountSettingsPage />} />
                              <Route path="/dashboard/organizer/transactions" element={<TransactionsPage />} />
                              <Route path="/dashboard/organizer/attendees" element={<AttendeesPage />} />
                        </Route>

                        <Route path="*" element={<div>404 Not Found</div>} />
                  </Routes>
            </div>
      );
}

export default App;
