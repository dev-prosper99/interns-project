import { useState, FormEvent } from "react";
import logo from "@/assets/images/logo.png"
import crowd from "@/assets/images/crowd.jpg"
import avatar1 from "@/assets/images/avatar1.jpg"
import avatar2 from "@/assets/images/avatar2.jpg"
import avatar3 from "@/assets/images/avatar3.jpg"
import { BackIcon } from "@/assets/icons";
import { LockIcon } from "@/assets/icons";

interface ForgotPasswordProps {
  onSubmit?: (email: string) => void;

  onBackToLogin?: () => void;
}

const ForgotPassword = ({ onSubmit, onBackToLogin }: ForgotPasswordProps) => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    onSubmit?.(email);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-white">
      {/* ===== Left panel — desktop only ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={crowd} alt="crowd" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-950/60 to-black/90" />
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" />
          </div>
          <div>
            <p className="text-4xl font-bold leading-tight mb-4">
              Nigeria's events are waiting for you.
            </p>
            <p className="text-neutral-300 mb-6">
              Sign in to access your tickets, discover upcoming events, and
              never miss a moment that matters.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                <img src={avatar1} alt="" className="w-9 h-9 rounded-full border-2 border-black object-cover"/>
                <img src={avatar2} alt="" className="w-9 h-9 rounded-full border-2 border-black object-cover"/>
                <img src={avatar3} alt="" className="w-9 h-9 rounded-full border-2 border-black object-cover"/>
              </div>
              <p className="text-sm font-medium">1M+ people already on TixO</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Right panel — form (all breakpoints) ===== */}
      <div className="flex-1 flex flex-col">
        {/* Tix logo — mobile header only */}
        <div className="lg:hidden flex items-center gap-2 p-6">
          <img src={logo} alt="" className="w-25 h-9"/>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-8">
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-full bg-purple-900/60 flex items-center justify-center">
                <LockIcon />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-1">
              Forgot Password?
            </h1>
            <p className="text-neutral-400 text-sm text-center mb-6">
              No worries, we will send you reset instructions.
            </p>
            <form onSubmit={handleSubmit}>
              <label className="text-sm font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Enter the email with which you've registered.
              </p>
              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium"
              >
                Login
              </button>
            </form>
            <button
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-2 mt-4 text-sm text-purple-400 hover:text-purple-300"
            >
              <BackIcon />
              back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
