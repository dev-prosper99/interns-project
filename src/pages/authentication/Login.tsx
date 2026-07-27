import Discover from "@/assets/images/discover.png";
import Logo from "@/assets/images/logo.png";
import PhotoIcon1 from "@/assets/images/PhotoIcon1.png";
import PhotoIcon2 from "@/assets/images/PhotoIcon2.png";
import PhotoIcon3 from "@/assets/images/PhotoIcon3.png";
import { Input } from "@/components/ui/input";
import { GoogleIcon, AppleIcon } from "@/assets/icons";
 
const Login = () => {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-black">
    
      <div className="absolute top-6 left-6 z-20 lg:hidden">
        <img src={Logo} alt="Logo" className="h-10 w-auto" />
      </div>
 
      
      <div
        className="relative hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${Discover})` }}
      >
      
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(94,38,167,0.45)] to-[rgba(16,2,39,0.85)]" />
 
      
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
            Sign in to access your tickets, discover upcoming events, and
            never miss a moment that matters.
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
 
      
      <div className="flex w-full items-center justify-center h-full  not-last-of-type:   bg-[#111213] px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-150 rounded-xl bg-[#161718] p-8">
          <h2 className="text-center text-3xl font-bold text-white">
            Login
          </h2>
 
          <p className="mt-2 text-center text-sm text-gray-400">
            Kindly enter your email and password to log in
          </p>
 
          <div className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-white"
              >
                Email
              </label>
 
              <Input
                id="email"
                placeholder="Email"
              />
            </div>
 
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-white"
              >
                Password
              </label>
 
              <Input
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>
 
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2"
                />
 
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-400"
                >
                  Remember me
                </label>
              </div>
 
              <button className="text-sm text-purple-500 hover:underline">
                Forgot password
              </button>
            </div>
 
            <button className="w-full rounded-lg bg-purple-500 py-3 text-white transition-colors hover:bg-purple-600">
              Login
            </button>
 
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-700" />
              <span className="text-sm text-gray-400">Or</span>
              <div className="h-px flex-1 bg-gray-700" />
            </div>
 
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D1E20] py-3 text-white">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
 
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D1E20] py-3 text-white">
              <AppleIcon />
              <span>Continue with Apple</span>
            </button>
 
            <p className="pt-4 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button className="font-medium text-purple-500 hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Login;