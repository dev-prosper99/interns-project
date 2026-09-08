import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Security() {
      const [showCurrentPassword, setShowCurrentPassword] = useState(false);
      const [showNewPassword, setShowNewPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      return (
            <div className="w-full font-poppins">
                  <div className="flex min-h-[calc(100vh-220px)] flex-col rounded-2xl bg-neutral-1000 p-4 py-6 sm:p-6">
                        <h3 className="mb-4 text-lg font-medium text-white">Security </h3>

                        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                              <div className="w-full">
                                    <Input label="Email address" type="email" placeholder="Email" />
                              </div>

                              <div className="w-full">
                                    <Input
                                          label="Current Password"
                                          type={showCurrentPassword ? "text" : "password"}
                                          placeholder="............."
                                          trailingIcon={
                                                <button
                                                      type="button"
                                                      onClick={() => setShowCurrentPassword((value) => !value)}
                                                      className="text-neutral-400 transition-colors hover:text-white"
                                                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                                                >
                                                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                          }
                                    />
                              </div>

                              <div className="w-full">
                                    <Input
                                          label="New Password"
                                          type={showNewPassword ? "text" : "password"}
                                          placeholder="............."
                                          trailingIcon={
                                                <button
                                                      type="button"
                                                      onClick={() => setShowNewPassword((value) => !value)}
                                                      className="text-neutral-400 transition-colors hover:text-white"
                                                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                                                >
                                                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                          }
                                    />
                              </div>

                              <div className="w-full">
                                    <Input
                                          label="Confirm Password"
                                          type={showConfirmPassword ? "text" : "password"}
                                          placeholder="............."
                                          trailingIcon={
                                                <button
                                                      type="button"
                                                      onClick={() => setShowConfirmPassword((value) => !value)}
                                                      className="text-neutral-400 transition-colors hover:text-white"
                                                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                                >
                                                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                          }
                                    />
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
