import { Button } from "@/components/ui/button";
import { Verified, X } from "lucide-react";
import qrCode from "@/assets/qrCode.png";

interface QRCodeModalProps {
      onClose: () => void;
      title: string;
      ticketID: string;
      type: string;
      numberOfTicket: number;
}

export default function QRCodeModal({ onClose, title, ticketID, type, numberOfTicket }: QRCodeModalProps) {
      return (
            <div className="max-h-[90vh] w-full max-w-100 flex items-center flex-col overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-1000 shadow-2xl">
                  <div className=" font-poppins px-6 py-7">
                        <div className="flex items-start justify-between mb-5">
                              <h2 className="text-lg font-normal text-neutral-100">QR Code</h2>
                              <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="h-6 w-6 rounded-full p-0 flex items-center border-neutral-400 text-neutral-400 hover:text-neutral-300"
                                    aria-label="Close"
                              >
                                    <X size={18} />
                              </Button>
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                              <div className="max-w-100 border border-orange-600 border-dashed rounded-2xl p-3">
                                    <img src={qrCode} alt="QR Code" className="w-full h-full rounded-2xl object-center object-contain" loading="lazy" />
                              </div>
                              <div className="w-full px-4">
                                    <p className="text-white text-sm md:text-lg font-medium mb-2">{title}</p>
                                    <p className="text-base font-semibold text-orange-600 mb-2">{ticketID}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                          <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">{type}</div>
                                          <span className="text-neutral-400 text-xs">×{numberOfTicket}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                          <div className="rounded-full border-green-400/20 text-xs">
                                                <Verified size="1rem" className="text-green-600" />
                                          </div>
                                          <span className="text-green-400 text-xs">Valid for entry — Scan at the gate</span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
