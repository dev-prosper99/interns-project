import Discover from "@/assets/images/discover.png";
import Logo from "@/assets/images/logo.png";
import { Input } from "@/components/ui/input";
import { GoogleIcon, AppleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { TickIcon } from "@/assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "@/components/ui/alert";

const benefits = [
  "Instant ticket delivery to your inbox",
  "Secure and verified ticketing platform",
  "Access to exclusive events and experiences",
];

const SignUp = () => {
  const [role, setRole] = useState<"attendee" | "organizer">("attendee");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      
      const nameParts = fullName.trim().split(/\s+/);

      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ");

      
      if (!firstname || !lastname) {
        setError("Please enter your first and last name.");
        return;
      }

      
      const response = await fetch(
        "https://ticketing-management-system-be.onrender.com/api/Auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            role: role === "attendee" ? "Attendee" : "Organizer",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registration successful:", data);

      const registeredFullName = fullName.trim();
      const registeredFirstName = String(firstname || "").trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (registeredFullName) {
        localStorage.setItem("fullName", registeredFullName);
      }

      if (normalizedEmail) {
        localStorage.setItem("email", normalizedEmail);
      }

      if (registeredFirstName) {
        localStorage.setItem("firstName", registeredFirstName);
      }

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen flex-col bg-neutral-1000 lg:flex-row">
    
      <div
        className="sticky top-0 hidden h-screen flex-col bg-cover bg-center p-10 lg:flex lg:w-1/2"
        style={{ backgroundImage: `url(${Discover})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-[rgba(94,38,167,0.45)] to-[rgba(16,2,39,0.85)]" />

        <div className="absolute z-20 w-[162.5px]">
          <img src={Logo} alt="Logo" className="h-auto" />
        </div>

        <div className="z-10 mt-auto max-w-lg">
          <h1 className="text-[52px] font-bold leading-tight text-white">
            Your seat at Nigeria's best events starts here.
          </h1>

          <p className="mt-4 text-sm text-white/90">
            Join over 1 million+ people discovering, attending, and creating
            extraordinary events across the Country.
          </p>

          <div className="mt-8 space-y-4 text-white">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <TickIcon />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      <div className="h-screen w-full overflow-y-auto p-8 lg:w-1/2 lg:pt-8">
      
        <div className="mb-6 w-[162.5px] lg:hidden">
          <img src={Logo} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="w-full max-w-150 rounded-xl bg-neutral-925 p-8">
        
          <div className="mx-auto flex h-11 w-64.5 items-center justify-center gap-2 rounded-2xl bg-neutral-900 p-1">
            <Button
              type="button"
              variant={role === "attendee" ? "primary" : "inactive"}
              size="sm"
              className="min-w-29.75"
              onClick={() => setRole("attendee")}
            >
              Attendee
            </Button>

            <Button
              type="button"
              variant={role === "organizer" ? "primary" : "inactive"}
              size="sm"
              className="min-w-29.75"
              onClick={() => setRole("organizer")}
            >
              Organizer
            </Button>
          </div>

          <h2 className="text-center text-3xl font-bold text-white">
            Create your account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-400">
            Kindly enter your details to create an account
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSignUp} className="mt-8 space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-2 block text-white">
                Full Name
              </label>

              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-white">
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2"
                  disabled={isLoading}
                />

                <label htmlFor="remember" className="text-sm text-gray-400">
                  Remember me
                </label>
              </div>
            </div>

            {error && (
              <Alert
                type="error"
                title="Registration failed"
                message={error}
                onClose={() => setError("")}
              />
            )}

            {/* Create Account */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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

            {/* Terms */}
            <p className="pt-4 text-center text-sm text-gray-400">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-purple-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-purple-500 hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Login */}
            <p className="pt-4 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
