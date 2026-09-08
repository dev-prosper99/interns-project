import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
      const initials = "AD";

      return (
            <div className="w-full font-poppins">
                  <div className="flex min-h-[calc(100vh-220px)] flex-col rounded-2xl bg-neutral-1000 p-4 py-6 sm:p-6">
                        <h3 className="mb-4 text-lg font-medium text-white">Profile Information</h3>

                        <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-xl font-semibold text-white">
                                          {initials}
                                    </div>

                                    <button
                                          type="button"
                                          aria-label="Upload profile photo"
                                          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-200 bg-neutral-200 text-neutral-600 shadow-lg"
                                    >
                                          <Camera size={16} />
                                    </button>
                              </div>

                              <div className="flex flex-col">
                                    <span className="text-base font-medium text-white">Profile Photo</span>
                                    <span className="text-sm text-neutral-400">This image will be displayed on your profile</span>
                              </div>
                        </div>

                        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                              <div className="w-full">
                                    <Input label="Full name" type="text" placeholder="Name" />
                              </div>

                              <div className="w-full">
                                    <Input label="Email address" type="email" placeholder="Email" />
                              </div>

                              <div className="w-full">
                                    <Input label="Phone number" type="tel" placeholder="Phone" />
                              </div>

                              <div className="w-full">
                                    <Input label="City" type="text" placeholder="Lagos" />
                              </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-8">
                              <Button type="button" variant="neutral" size="lg" className="w-full md:w-fit">
                                    Save Changes
                              </Button>
                        </div>
                  </div>
            </div>
      );
}
