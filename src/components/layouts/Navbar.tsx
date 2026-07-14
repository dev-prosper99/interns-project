import React from "react";
import { Button } from "../ui/button";
import logo from "@/assets/logo.png";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-black border-t-2 border-purple-600">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        
        
        <div>
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        
        <ul className="hidden md:flex items-center gap-8 text-sm text-white">
          <li>
            <a href="#discover" className="hover:text-purple-400">
              Discover
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-purple-400">
              About Us
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-purple-400">
              Contact Us
            </a>
          </li>
        </ul>
        
    
        <div className="flex items-center gap-4">
          <Button variant="outline">Log In</Button>
          <Button variant="primary">Get Started</Button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;


