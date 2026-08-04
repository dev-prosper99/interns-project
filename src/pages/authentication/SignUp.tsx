import Discover from "@/assets/images/discover.png";
import Logo from "@/assets/images/logo.png";
import { Input } from "@/components/ui/input";
import { GoogleIcon, AppleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { TickIcon } from "@/assets/icons";
import { Link } from "react-router-dom";
import { useState } from "react";

const benefits = [
  "Instant ticket delivery to your inbox",
  "Secure and verified ticketing platform",
  "Access to exclusive events and experiences",
];
const SignUp = () => {
  const [role, setRole] = useState<"attendee" | "organizer">("attendee");

  return (
    <div className="relative h-screen flex flex-col lg:flex-row bg-neutral-1000 ">
      <div
        className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen bg-cover bg-center flex-col p-10 "
        style={{ backgroundImage: `url(${Discover})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-[rgba(94,38,167,0.45)] to-[rgba(16,2,39,0.85)]" />

        <div className="w-[162.5px] absolute z-20">
          <img src={Logo} alt="Logo" className="h-auto" />
        </div>

        <div className="z-10 max-w-lg content-end mt-auto">
          <h1 className="text-[52px] font-bold leading-tight text-white">
            Your seat at Nigeria's best events starts here.
          </h1>

          <p className="mt-4 text-sm text-white/90">
            Join over 1 million+ people discovering, attending, and creating
            extraordinary events across the Country.
          </p>

          <div className="mt-8 items-center text- text-white">
            <div className="mt-8 text-white space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <TickIcon />
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full lg:w-1/2 h-screen overflow-y-auto p-8  lg:pt-8 justify-center ">
        <div className="w-[162.5px]  lg:hidden  mb-6">
          <img src={Logo} alt="Logo" className="h-10 w-auto " />
        </div>

        <div className="w-full max-w-150 rounded-xl bg-neutral-925 p-8">
          <div className="mx-auto flex w-64.5 h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-900 p-1">
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

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="text" className="mb-2 block text-white">
                Full Name
              </label>

              <Input id="text" placeholder="John Doe" />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-white">
                Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-white">
                Password
              </label>

              <Input id="password" type="password" placeholder="Password" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />

                <label htmlFor="remember" className="text-sm text-gray-400">
                  Remember me
                </label>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              Create Account
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-700" />
              <span className="text-sm text-gray-400">Or</span>
              <div className="h-px flex-1 bg-gray-700" />
            </div>

            <Button variant="dark">
              <GoogleIcon />
              <span>Continue with Google</span>
            </Button>

            <Button variant="dark">
              <AppleIcon />
              <span>Continue with Apple</span>
            </Button>

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

            <p className="pt-4 text-center text-sm text-gray-400">
              Already have an account ?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
