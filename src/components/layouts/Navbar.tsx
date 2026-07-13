import React from "react";
import { LoginButton, PrimaryButton } from "../ui/button";
import logo from "@/assets/logo.png";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
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
          <LoginButton><NavLink to="/login">Log In</NavLink></LoginButton>
          <PrimaryButton><NavLink to="/sign-up">Get Started</NavLink></PrimaryButton>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;


