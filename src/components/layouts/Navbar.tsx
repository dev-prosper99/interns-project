import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import logo from "@/assets/images/logo.png";
import { clearAuthStorage, getStoredAvatarUrl } from "@/lib/api";

const Navbar: React.FC = () => {
      const navigate = useNavigate();
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const menuRef = useRef<HTMLDivElement>(null);
      const isLoggedIn = Boolean(localStorage.getItem("token"));
      const displayName = (localStorage.getItem("fullName") || localStorage.getItem("firstName") || "User").trim().replace(/\s+/g, " ") || "User";
      const avatarUrl = getStoredAvatarUrl(localStorage.getItem("email") || undefined);
      const initials =
            displayName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "U";

      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                        setIsMenuOpen(false);
                  }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const navigateToLogin = (pageLink: string) => {
            navigate(`/${pageLink}`, { replace: true });
      };

      const handleLogout = () => {
            clearAuthStorage();
            setIsMenuOpen(false);
            navigate("/login", { replace: true });
      };

      return (
            <nav className="fixed inset-x-0 top-0 z-50 w-full border-t-2 bg-black/90 px-4 backdrop-blur-sm md:px-20">
                  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
                        <div>
                              <img src={logo} alt="Logo" className="h-8 w-auto" />
                        </div>

                        <ul className="hidden items-center gap-8 text-sm text-white md:flex">
                              <li>
                                    <NavLink to="/discover" className="hover:text-purple-400">
                                          Discover
                                    </NavLink>
                              </li>
                        </ul>

                        <div className="flex items-center gap-2 sm:gap-4">
                              {isLoggedIn ? (
                                    <div ref={menuRef} className="relative">
                                          <button
                                                type="button"
                                                aria-label="Open account menu"
                                                aria-expanded={isMenuOpen}
                                                onClick={() => setIsMenuOpen((open) => !open)}
                                                className="flex items-center gap-2 rounded-full p-1 text-white transition-colors hover:bg-white/10"
                                          >
                                                {avatarUrl ? (
                                                      <img src={avatarUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                                                            {initials}
                                                      </span>
                                                )}
                                                <ChevronDown className={`hidden h-4 w-4 transition-transform sm:block ${isMenuOpen ? "rotate-180" : ""}`} />
                                          </button>

                                          {isMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-1 shadow-xl">
                                                      <div className="border-b border-white/10 px-3 py-2">
                                                            <p className="truncate text-sm font-medium text-white">{displayName}</p>
                                                      </div>
                                                      <button
                                                            type="button"
                                                            onClick={() => {
                                                                  setIsMenuOpen(false);
                                                                  const role = (localStorage.getItem("role") || "attendee").toLowerCase();
                                                                  navigate(role === "organizer" ? "/dashboard/organizer" : "/dashboard/attendee");
                                                            }}
                                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-neutral-200 hover:bg-white/10"
                                                      >
                                                            <LayoutDashboard className="h-4 w-4 text-orange-500" />
                                                            DashBoard
                                                      </button>
                                                      <button
                                                            type="button"
                                                            onClick={handleLogout}
                                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-white/10"
                                                      >
                                                            <LogOut className="h-4 w-4" />
                                                            Log Out
                                                      </button>
                                                </div>
                                          )}
                                    </div>
                              ) : (
                                    <>
                                          <Button variant="outline" onClick={() => navigateToLogin("login")}>
                                                Log In
                                          </Button>
                                          <Button variant="primary" onClick={() => navigateToLogin("sign-up")}>
                                                Get Started
                                          </Button>
                                    </>
                              )}
                        </div>
                  </div>
            </nav>
      );
};

export default Navbar;
