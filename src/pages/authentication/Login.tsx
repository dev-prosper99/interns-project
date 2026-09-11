import Discover from "@/assets/images/discover.png";
import Logo from "@/assets/images/logo.png";
import PhotoIcon1 from "@/assets/images/PhotoIcon1.png";
import PhotoIcon2 from "@/assets/images/PhotoIcon2.png";
import PhotoIcon3 from "@/assets/images/PhotoIcon3.png";
import { Input } from "@/components/ui/input";
import { GoogleIcon, AppleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

type AuthPayload = Record<string, unknown>;
type LoginLocationState = { from?: string; ticketQuantities?: Record<string, number> };

const asRecord = (value: unknown): AuthPayload => (typeof value === "object" && value !== null ? (value as AuthPayload) : {});

const getAuthToken = (payload: unknown): string | null => {
      const root = asRecord(payload);
      const data = asRecord(root.data);
      const user = asRecord(root.user);
      const candidates = [
            root.token,
            root.accessToken,
            root.authToken,
            root.jwt,
            data.token,
            data.accessToken,
            data.authToken,
            data.jwt,
            user.token,
            user.accessToken,
      ];

      const token = candidates.find((value) => typeof value === "string" && value.trim().length > 0);

      return typeof token === "string" ? token : null;
};

const getDisplayFirstName = (payload: unknown, fallback = ""): string => {
      const root = asRecord(payload);
      const user = asRecord(root.user);
      const rawName = user.firstname || user.firstName || root.firstname || root.firstName || root.name || root.fullName || user.name || fallback;

      const cleaned = String(rawName || "")
            .trim()
            .replace(/\s+/g, " ");

      if (!cleaned) return fallback;

      return cleaned.split(" ")[0];
};

const fullNameFromEmail = (email: string): string => {
      if (!email || !email.includes("@")) return "";

      const localPart = email.split("@")[0];
      return localPart
            .split(/[._-]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
};

const Login = () => {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [isPasswordVisible, setIsPasswordVisible] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const [alert, setAlert] = useState<{
            type: "success" | "error";
            title: string;
            message: string;
      } | null>(null);

      const navigate = useNavigate();
      const location = useLocation();

      const handleLogin = async () => {
            setAlert(null);

            if (!email.trim() || !password.trim()) {
                  setAlert({
                        type: "error",
                        title: "Login Error",
                        message: "Please input your email and password",
                  });

                  return;
            }

            setIsLoading(true);

            try {
                  const response = await fetch("https://peacemaker001-001-site1.ltempurl.com/api/Auth/login", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                              email,
                              password,
                        }),
                  });

                  const data = (await response.json()) as AuthPayload;
                  const user = asRecord(data.user);

                  if (!response.ok) {
                        throw new Error(String(data.message || "Invalid email or password"));
                  }

                  const authToken = getAuthToken(data);

                  if (!authToken) {
                        throw new Error("Authentication token was not returned by the server.");
                  }

                  const savedFirstName = localStorage.getItem("firstName") || "";
                  const savedFullName = localStorage.getItem("fullName") || "";
                  const responseFirstName = getDisplayFirstName(data, savedFirstName);
                  const finalFirstName = (responseFirstName || savedFirstName || email.split("@")[0]).trim();
                  const normalizedEmail = email.trim().toLowerCase();
                  const finalFullName = String(user.name || user.fullName || savedFullName || fullNameFromEmail(normalizedEmail)).trim();

                  localStorage.setItem("token", authToken);
                  localStorage.setItem("refreshToken", String(data.refreshToken || data.refresh_token || ""));
                  localStorage.setItem("email", normalizedEmail);

                  if (finalFirstName) {
                        localStorage.setItem("firstName", finalFirstName);
                  }

                  if (finalFullName) {
                        localStorage.setItem("fullName", finalFullName);
                  }

                  setAlert({
                        type: "success",
                        title: "Login Successful",
                        message: "Welcome back!",
                  });
                  const payload = JSON.parse(atob(authToken.split(".")[1])) as AuthPayload;

                  const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

                  localStorage.setItem("userId", String(userId));

                  const role = String(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "")
                        .trim()
                        .toLowerCase();

                  localStorage.setItem("role", role);

                  const returnState = location.state as LoginLocationState | null;
                  const returnPath = returnState?.from?.startsWith("/") ? returnState.from : null;

                  if (role === "organizer") {
                        navigate("/dashboard/organizer");
                  } else if (role === "attendee") {
                        navigate(returnPath || "/dashboard/attendee", {
                              state: returnState?.ticketQuantities ? { ticketQuantities: returnState.ticketQuantities } : undefined,
                        });
                  }
            } catch (error) {
                  if (error instanceof Error) {
                        setAlert({
                              type: "error",
                              title: "Login Failed",
                              message: error.message,
                        });
                  } else {
                        setAlert({
                              type: "error",
                              title: "Login Failed",
                              message: "Something went wrong. Please try again.",
                        });
                  }
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <div className="relative h-screen flex flex-col lg:flex-row bg-neutral-1000">
                  {/* Left Section */}
                  <div className="relative hidden lg:block lg:w-1/2 top-0 h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Discover})` }}>
                        <div className="absolute inset-0 bg-linear-to-b from-[rgba(94,38,167,0.45)] to-[rgba(16,2,39,0.85)]" />

                        {/* Logo */}
                        <img src={Logo} alt="Logo" className="absolute top-10 left-10 z-10 w-[162.5px] h-auto" />

                        {/* Left Content */}
                        <div className="absolute bottom-10 left-10 z-10 max-w-lg">
                              <h1 className="text-[52px] font-bold leading-tight text-white">Nigeria's events are waiting for you.</h1>

                              <p className="mt-4 text-sm text-white/90">
                                    Sign in to access your tickets, discover upcoming events, and never miss a moment that matters.
                              </p>

                              <div className="mt-8 flex items-center">
                                    <div className="flex space-x-4">
                                          <img src={PhotoIcon1} alt="" className="h-12 w-12 rounded-full border-2 border-white" />

                                          <img src={PhotoIcon2} alt="" className="h-12 w-12 rounded-full border-2 border-white" />

                                          <img src={PhotoIcon3} alt="" className="h-12 w-12 rounded-full border-2 border-white" />
                                    </div>

                                    <p className="ml-4 text-sm text-white">1M+ people already on TiXO</p>
                              </div>
                        </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex w-full items-center justify-center h-screen overflow-y-auto bg-900 px-6 py-16 lg:w-1/2">
                        <div className="w-full max-w-150">
                              {/* Mobile Logo */}
                              <div className="flex justify-center mb-6 lg:hidden">
                                    <img src={Logo} alt="Logo" className="h-10 w-auto" />
                              </div>

                              {/* Login Card */}
                              <div className="rounded-xl bg-neutral-925 p-8">
                                    <h2 className="text-center text-3xl font-bold text-white">Login</h2>

                                    <p className="mt-2 text-center text-sm text-gray-400">Kindly enter your email and password to log in</p>

                                    <div className="mt-8 space-y-5">
                                          {/* Alert */}
                                          {alert && <Alert type={alert.type} title={alert.title} message={alert.message} onClose={() => setAlert(null)} />}

                                          {/* Email */}
                                          <div>
                                                <label htmlFor="email" className="mb-2 block text-white">
                                                      Email
                                                </label>

                                                <Input
                                                      id="email"
                                                      type="email"
                                                      placeholder="Email"
                                                      value={email}
                                                      onChange={(e) => setEmail(e.target.value)}
                                                      disabled={isLoading}
                                                />
                                          </div>

                                          {/* Password */}
                                          <div>
                                                <label htmlFor="password" className="mb-2 block text-white">
                                                      Password
                                                </label>

                                                <Input
                                                      id="password"
                                                      type={isPasswordVisible ? "text" : "password"}
                                                      placeholder="Password"
                                                      value={password}
                                                      onChange={(e) => setPassword(e.target.value)}
                                                      disabled={isLoading}
                                                      trailingIcon={
                                                            <button
                                                                  type="button"
                                                                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                                                  title={isPasswordVisible ? "Hide password" : "Show password"}
                                                                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                                                                  disabled={isLoading}
                                                                  className="text-neutral-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                      }
                                                />
                                          </div>

                                          {/* Remember Me + Forgot Password */}
                                          <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                      <input type="checkbox" id="remember" className="mr-2" disabled={isLoading} />

                                                      <label htmlFor="remember" className="text-sm text-gray-400">
                                                            Remember me
                                                      </label>
                                                </div>

                                                <Link to="/forgot-password" className="text-sm text-purple-500 hover:text-purple-400">
                                                      Forgot Password?
                                                </Link>
                                          </div>

                                          {/* Login Button */}
                                          <Button onClick={handleLogin} variant="primary" className="w-full" disabled={isLoading}>
                                                {isLoading ? "Logging in..." : "Login"}
                                          </Button>

                                          {/* Divider */}
                                          <div className="flex items-center gap-4">
                                                <div className="h-px flex-1 bg-gray-700" />

                                                <span className="text-sm text-gray-400">Or</span>

                                                <div className="h-px flex-1 bg-gray-700" />
                                          </div>

                                          {/* Google */}
                                          <Button type="button" variant="dark">
                                                <GoogleIcon />
                                                <span>Continue with Google</span>
                                          </Button>

                                          {/* Apple */}
                                          <Button type="button" variant="dark">
                                                <AppleIcon />
                                                <span>Continue with Apple</span>
                                          </Button>

                                          {/* Sign Up */}
                                          <p className="pt-4 text-center text-sm text-gray-400">
                                                Don't have an account?{" "}
                                                <Link to="/sign-up" className="text-purple-500 hover:text-purple-400">
                                                      Sign Up
                                                </Link>
                                          </p>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default Login;
