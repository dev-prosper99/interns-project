import { useState, type ComponentType, type CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRound, X } from "lucide-react";
import { DashboardIcon, EventIcon, TicketIcon, AnalyticsIcon, TransactionIcon, AttendeeIcon, SettingsIcon, LogoutIcon, DownarrowIcon } from "@/assets/icons";
import logo from "@/assets/images/logo.png";
import { clearAuthStorage, getStoredAvatarUrl } from "@/lib/api";

type SidebarIcon = ComponentType<{
      color?: string;
      style?: CSSProperties;
}>;

export type SidebarItem = {
      label: string;
      path: string;
      icon: SidebarIcon;
      isActive?: (pathname: string, path: string) => boolean;
};

export type SidebarProps = {
      items?: SidebarItem[];
      logoSrc?: string;
      logoutPath?: string;
      onClose?: () => void;
};

const defaultNavItems: SidebarItem[] = [
      { label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
      { label: "Events", icon: EventIcon, path: "/events" },
      { label: "Tickets", icon: TicketIcon, path: "/tickets" },
      { label: "Analytics", icon: AnalyticsIcon, path: "/analytics" },
      { label: "Transactions", icon: TransactionIcon, path: "/transactions" },
      { label: "Attendees", icon: AttendeeIcon, path: "/attendees" },
      { label: "Settings", icon: SettingsIcon, path: "/settings" },
];

export default function Sidebar({ items = defaultNavItems, logoSrc = logo, logoutPath = "/login", onClose }: SidebarProps) {
      const [showLogoutMenu, setShowLogoutMenu] = useState(false);
      const navigate = useNavigate();
      const location = useLocation();

      const displayName = (localStorage.getItem("fullName") || localStorage.getItem("firstName") || "User").trim().replace(/\s+/g, " ") || "User";

      const userEmail = (localStorage.getItem("email") || "your@email.com").trim() || "your@email.com";
      const profilePath = localStorage.getItem("role")?.trim().toLowerCase() === "attendee" ? "/my-settings" : "/settings";
      const avatarUrl = getStoredAvatarUrl(localStorage.getItem("email") || undefined);

      const initials =
            displayName
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("") || "U";

      const handleLogout = () => {
            clearAuthStorage();
            setShowLogoutMenu(false);
            navigate(logoutPath);
      };

      return (
            <aside className="sticky top-0 z-30 flex h-dvh min-h-dvh w-full shrink-0 flex-col overflow-y-auto overscroll-contain bg-neutral-1000 px-3 py-5 lg:w-60 xl:w-64">
                  <div className="flex min-h-0 flex-1 flex-col">
                        <div className="mb-8 flex items-center justify-between gap-3 px-2">
                              <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
                              {onClose && (
                                    <button
                                          type="button"
                                          onClick={onClose}
                                          aria-label="Close menu"
                                          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 transition-colors  hover:bg-white/10 hover:text-white lg:hidden"
                                    >
                                          <X size={20} strokeWidth={2} />
                                    </button>
                              )}
                        </div>

                        <nav className="flex flex-col gap-1" aria-label="Main navigation">
                              {items.map(({ label, icon: Icon, path, isActive: isActiveMatcher }) => {
                                    const isActive = isActiveMatcher ? isActiveMatcher(location.pathname, path) : location.pathname.startsWith(path);
                                    return (
                                          <button
                                                key={label}
                                                onClick={() => navigate(path)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left
                  ${isActive ? " text-white bg-purple-500 font-bold" : "text-neutral-400 hover:text-white"}`}
                                          >
                                                <Icon color={isActive ? "white" : "#A2A4A9"} style={{ fontWeight: isActive ? 700 : 400 }} />
                                                {label}
                                          </button>
                                    );
                              })}
                        </nav>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 relative">
                        <button
                              type="button"
                              onClick={() => setShowLogoutMenu((prev) => !prev)}
                              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer text-left"
                        >
                              {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                              ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500 text-[10px] font-semibold text-white">
                                          {initials}
                                    </div>
                              )}
                              <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate leading-tight">{displayName}</p>
                                    <p className="text-neutral-500 text-[11px] truncate leading-tight mt-0.5">{userEmail}</p>
                              </div>
                              <span
                                    className={`text-neutral-300 text-lg leading-none transition-transform duration-200 ${
                                          showLogoutMenu ? "rotate-180" : "rotate-0"
                                    }`}
                              >
                                    <DownarrowIcon />
                              </span>
                        </button>

                        {showLogoutMenu && (
                              <div className="absolute bottom-full left-0 right-0 mb-3 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl shadow-black/30">
                                    <button
                                          type="button"
                                          onClick={() => {
                                                setShowLogoutMenu(false);
                                                navigate(profilePath);
                                          }}
                                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-100 transition-colors hover:bg-white/10"
                                    >
                                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/15 text-purple-300">
                                                <UserRound size={16} strokeWidth={2} />
                                          </span>
                                          <span>Profile</span>
                                    </button>
                                    <button
                                          type="button"
                                          onClick={handleLogout}
                                          className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-white/10 px-3 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                    >
                                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10">
                                                <LogoutIcon />
                                          </span>
                                          <span>Log Out</span>
                                    </button>
                              </div>
                        )}
                  </div>
            </aside>
      );
}
