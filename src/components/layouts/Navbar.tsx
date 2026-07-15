import React from "react";
import { Button } from "../ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const navigateToLogin = (pageLink: string) => {
    navigate(`/${pageLink}`, { replace: true });
  };
  return (
    <nav className="w-full bg-black border-t-2 border-purple-600">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <div>
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        <ul className="hidden md:flex items-center gap-8 text-sm text-white">
          <li>
            <NavLink to="/discover" className="hover:text-purple-400">
              Discover
            </NavLink>
          </li>
          <li>
            <NavLink to="/about-us" className="hover:text-purple-400">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact-us" className="hover:text-purple-400">
              Contact Us
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigateToLogin("login")}>
            Log In
          </Button>
          <Button variant="primary" onClick={() => navigateToLogin("sign-up")}>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
