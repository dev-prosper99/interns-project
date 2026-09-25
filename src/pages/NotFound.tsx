import { Link } from "react-router-dom";

export default function NoFound() {
      return (
            <div>
                  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
                        <div className="max-w-md">
                              <h1 className="text-8xl font-extrabold tracking-tight text-red-500 animate-bounce">404</h1>
                              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page Not Found</h2>
                              <p className="mt-4 text-base leading-7 text-gray-600">
                                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                              </p>
                              <div className="mt-10">
                                    <Link
                                          to="/"
                                          className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                                    >
                                          Return to Homepage
                                    </Link>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
