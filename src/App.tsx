import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/Authentication/SignUp";
import Login from "./pages/Authentication/Login";


import Dashboard from "./pages/Dashboard";
import TicketsPage from "./components/DashBoard/Tickets/TicketsPage";

function App() {
  return (
    <div>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
