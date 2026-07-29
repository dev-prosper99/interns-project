import Discover from "@/assets/images/discover.png";
import Logo from "@/assets/images/logo.png";
import PhotoIcon1 from "@/assets/images/PhotoIcon1.png";
import PhotoIcon2 from "@/assets/images/PhotoIcon2.png";
import PhotoIcon3 from "@/assets/images/PhotoIcon3.png";
import { Input } from "@/components/ui/input";
import { GoogleIcon, AppleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
 
const Login = () => {
return (
 <div className="relative h-screen flex flex-col lg:flex-row bg-neutral-1000">
 
 <div
 className="relative hidden lg:block lg:w-1/2 sticky top-0 h-screen bg-cover bg-center"
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
 <h2 className="text-center text-3xl font-bold text-white">Login</h2>
 
 <p className="mt-2 text-center text-sm text-gray-400">
 Kindly enter your email and password to log in
 </p>
 
 <div className="mt-8 space-y-5">
 <div>
 <label htmlFor="email" className="mb-2 block text-white">
 Email
 </label>
 
 <Input id="email" placeholder="Email" />
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
 Login
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
 Don't have an account?{" "}
 <Link
 to="/sign-up"
 className="text-purple-500 hover:text-purple-400"
 >
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
 