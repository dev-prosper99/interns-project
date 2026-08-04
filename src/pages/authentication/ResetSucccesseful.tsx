import Discover from "@/assets/images/discover.png";
import Logo from "@/assets/images/logo.png";
import PhotoIcon1 from "@/assets/images/PhotoIcon1.png";
import PhotoIcon2 from "@/assets/images/PhotoIcon2.png";
import PhotoIcon3 from "@/assets/images/PhotoIcon3.png";

import { TickIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";

const SetPassword = () => {
  return (
    <div className="relative h-screen flex flex-col lg:flex-row bg-neutral-1000">
      <div
        className="relative hidden lg:block lg:w-1/2  top-0 h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${Discover})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-[rgba(94,38,167,0.45)] to-[rgba(16,2,39,0.85)]" />

        <img
          src={Logo}
          alt="Logo"
          className="absolute top-10 left-10 z-10 w-[162.5px] h-auto"
        />

        <div className="absolute bottom-10 left-10 z-10 max-w-lg">
          <h1 className="text-[52px] font-bold leading-tight text-white">
            Nigeria's events are waiting for you.
          </h1>

          <p className="mt-4 text-sm text-white/90">
            Sign in to access your tickets, discover upcoming events, and never
            miss a moment that matters.
          </p>

          <div className="mt-8 flex items-center">
            <div className="flex space-x-4">
              <img
                src={PhotoIcon1}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-white"
              />
              <img
                src={PhotoIcon2}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-white"
              />
              <img
                src={PhotoIcon3}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-white"
              />
            </div>

            <p className="ml-4 text-sm text-white">
              1M+ people already on TiXO
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center h-screen overflow-y-auto not-last-of-type: bg-900 px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-150">
          <div className="flex justify-center mb-6 lg:hidden">
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
          </div>

          <div className="rounded-xl bg-neutral-925 p-8">
            <div className="flex items-center justify-center mb-4 h-14.5 w-14.5 mx-auto rounded-full bg-[#0F973D3D] ">
              <TickIcon />
            </div>
            <h2 className="text-center text-3xl font-bold text-white">
              Password Reset Successfully
            </h2>

            <p className="mt-2 text-center text-sm text-gray-400">
              Your Password has been successfuly reset
            </p>

            <Button variant="primary" className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
