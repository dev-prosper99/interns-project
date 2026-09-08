import { useState, type Dispatch, type SetStateAction } from "react";
import { PlusIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TickIcon } from "@/assets/icons";
import { Events } from "@/constants/events";
import { FaMinus } from "react-icons/fa";
import { PiPlus } from "react-icons/pi";

const STEPS = [
      { key: "tickets", label: "Select Ticket", sub: "Select ticket tier" },
      { key: "review", label: "Review", sub: "Review your order" },
];

export type TicketQuantities = {
      regular: number;
      vip: number;
      vvip: number;
};

type GetTicketModalProps = {
      onClose: () => void;
      title: string;
      initialTicketQuantities: TicketQuantities;
};

export default function GetTicketModal({ onClose, title, initialTicketQuantities }: GetTicketModalProps) {
      const [stepIndex, setStepIndex] = useState(0);
      const [ticketQuantities, setTicketQuantities] = useState<TicketQuantities>(initialTicketQuantities);

      const currentIndex = stepIndex;

      const renderStep = () => {
            switch (STEPS[stepIndex].key) {
                  case "tickets":
                        return (
                              <SelectTickets
                                    title={title}
                                    ticketQuantities={ticketQuantities}
                                    setTicketQuantities={setTicketQuantities}
                                    onContinue={() => setStepIndex(1)}
                              />
                        );

                  case "review":
                        return <ReviewTicket title={title} ticketQuantities={ticketQuantities} onBack={() => setStepIndex(0)} />;

                  default:
                        return null;
            }
      };

      return (
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-1000 shadow-2xl">
                  <div className=" font-poppins px-6 py-7">
                        <div className="flex items-start justify-between mb-5">
                              <div>
                                    <h2 className="text-lg font-semibold text-neutral-100">Get Ticket</h2>
                                    <p className="text-sm text-neutral-400">Follow the steps to get your ticket </p>
                              </div>
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

                        <div className="mt-6 w-full">
                              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-[#121212] mb-7">
                                    {STEPS.map((step, i) => {
                                          const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";
                                          const stepNumber = i + 1;
                                          return (
                                                <div
                                                      key={step.key}
                                                      className={`min-h-17 px-4 py-3 flex items-center gap-3 border-r border-white/10 transition-colors last:border-r-0 ${
                                                            state === "active" ? "bg-[#3b2466]" : state === "done" ? "bg-[#7c3aed]" : "bg-[#161616]"
                                                      }`}
                                                >
                                                      <span
                                                            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                                                  state === "done"
                                                                        ? "bg-white text-purple-600"
                                                                        : state === "active"
                                                                          ? "bg-white text-purple-600"
                                                                          : "bg-neutral-400 text-neutral-200"
                                                            }`}
                                                      >
                                                            {state === "done" ? (
                                                                  <TickIcon className="h-3.5 w-3.5 text-purple-600" />
                                                            ) : (
                                                                  <span>{stepNumber}</span>
                                                            )}
                                                      </span>
                                                      <span className="min-w-0">
                                                            <span
                                                                  className={`block text-[13px] font-medium truncate ${
                                                                        state === "upcoming" ? "text-neutral-300" : "text-white"
                                                                  }`}
                                                            >
                                                                  {step.label}
                                                            </span>
                                                            <span
                                                                  className={`block text-[11px] truncate ${
                                                                        state === "upcoming"
                                                                              ? "text-neutral-400"
                                                                              : state === "done"
                                                                                ? "text-white/85"
                                                                                : "text-white/75"
                                                                  }`}
                                                            >
                                                                  {step.sub}
                                                            </span>
                                                      </span>
                                                </div>
                                          );
                                    })}
                              </div>
                              <div className="w-full">{renderStep()}</div>
                        </div>
                  </div>
            </div>
      );
}

import { EventIcon, LocationIcon } from "@/assets/icons";

function SelectTickets({
      title,
      onContinue,
      ticketQuantities,
      setTicketQuantities,
}: {
      title: string;
      onContinue: () => void;
      ticketQuantities: TicketQuantities;
      setTicketQuantities: Dispatch<SetStateAction<TicketQuantities>>;
}) {
      const [selectedTicket, setSelectedTicket] = useState<keyof TicketQuantities | null>(null);

      const event = Events.find((item) => item.eventTitle.replace(/\s+/g, "-").toLowerCase() === title.trim().toLowerCase());

      const regularPrice = Number(event?.regular_ticketPrice ?? 0);
      const vipPrice = Number(event?.vip_ticketPrice ?? 0);
      const vvipPrice = Number(event?.vvip_ticketPrice ?? 0);

      const updateTicketQuantity = (ticket: keyof TicketQuantities, quantity: number, limit: number) => {
            setSelectedTicket(ticket);

            setTicketQuantities((current) => ({
                  ...current,
                  [ticket]: Math.max(0, Math.min(quantity, limit)),
            }));
      };

      const selectedItems = [
            {
                  key: "regular",
                  label: "Regular",
                  quantity: ticketQuantities.regular,
                  price: regularPrice,
            },
            {
                  key: "vip",
                  label: "VIP",
                  quantity: ticketQuantities.vip,
                  price: vipPrice,
            },
            {
                  key: "vvip",
                  label: "VVIP",
                  quantity: ticketQuantities.vvip,
                  price: vvipPrice,
            },
      ].filter((item) => item.quantity > 0);

      const subtotal = selectedItems.reduce((total, item) => total + item.quantity * item.price, 0);

      const formatPrice = (amount: number) => amount.toLocaleString("en-NG");

      return (
            <div className="w-full">
                  <div className="flex items-start justify-between md:flex-nowrap flex-wrap gap-6">
                        <div className=" border border-neutral-800 rounded-2xl p-3 w-full">
                              <div className="flex flex-col gap-1">
                                    <h4 className="text-white text-lg">Select Ticket</h4>
                                    <p className="text-white font-normal text-sm">3 ticket types available</p>
                                    <div className="space-y-6 mt-4">
                                          <div
                                                onClick={() => setSelectedTicket("regular")}
                                                className={`${selectedTicket === "regular" ? "bg-purple-600/24 border-purple-600/24" : "bg-neutral-950"} rounded-2xl border border-neutral-800 p-3 space-y-8 transition-colors hover:border-purple-600/60`}
                                          >
                                                <div className="flex items-start justify-between gap-4">
                                                      <div className="min-w-0 space-y-1">
                                                            <h3 className="text-base font-medium text-white">Regular</h3>
                                                            <p className="text-xs font-normal text-neutral-400">Regular Sitting Area</p>
                                                      </div>
                                                      <div className="shrink-0">
                                                            <h3 className="text-lg font-semibold text-orange-600">
                                                                  ₦{Number(event?.regular_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                            </h3>
                                                            <p className="text-xs font-normal text-neutral-400">230 left</p>
                                                      </div>
                                                </div>
                                                <div className="w-fit">
                                                      <div className="flex items-center gap-1">
                                                            <button
                                                                  type="button"
                                                                  aria-label="Decrease regular tickets"
                                                                  disabled={ticketQuantities.regular === 0}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTicketQuantity("regular", ticketQuantities.regular - 1, 230);
                                                                  }}
                                                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  <FaMinus className="h-3 w-3" />
                                                            </button>
                                                            <span className="min-w-5 text-center text-sm font-medium text-white">
                                                                  {ticketQuantities.regular}
                                                            </span>
                                                            <button
                                                                  type="button"
                                                                  aria-label="Increase regular tickets"
                                                                  disabled={ticketQuantities.regular >= 230}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTicketQuantity("regular", ticketQuantities.regular + 1, 230);
                                                                  }}
                                                                  className="flex h-6 w-6  items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  <PiPlus />
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                          <div
                                                onClick={() => setSelectedTicket("vip")}
                                                className={`${selectedTicket === "vip" ? "bg-purple-600/24 border-purple-600/24" : "bg-neutral-950"} rounded-2xl border border-neutral-800 p-3 space-y-8 transition-colors hover:border-purple-600/60`}
                                          >
                                                <div className="flex items-start justify-between gap-4">
                                                      <div className="min-w-0 space-y-1">
                                                            <h3 className="text-base font-medium text-white">VIP</h3>
                                                            <p className="text-xs font-normal text-neutral-400">Best Experience</p>
                                                      </div>
                                                      <div className="shrink-0">
                                                            <h3 className="text-lg font-semibold text-orange-600">
                                                                  ₦{Number(event?.vip_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                            </h3>
                                                            <p className="text-xs font-normal text-neutral-400">40 left</p>
                                                      </div>
                                                </div>
                                                <div className="w-fit">
                                                      <div className="flex items-center gap-1">
                                                            <button
                                                                  type="button"
                                                                  aria-label="Decrease VIP tickets"
                                                                  disabled={ticketQuantities.vip === 0}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTicketQuantity("vip", ticketQuantities.vip - 1, 40);
                                                                  }}
                                                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  <FaMinus className="h-3 w-3" />
                                                            </button>
                                                            <span className="min-w-5 text-center text-sm font-medium text-white">{ticketQuantities.vip}</span>
                                                            <button
                                                                  type="button"
                                                                  aria-label="Increase VIP tickets"
                                                                  disabled={ticketQuantities.vip >= 40}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTicketQuantity("vip", ticketQuantities.vip + 1, 40);
                                                                  }}
                                                                  className="flex h-6 w-6  items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  <PiPlus />
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                          <div
                                                onClick={() => setSelectedTicket("vvip")}
                                                className={`${selectedTicket === "vvip" ? "bg-purple-600/24 border-purple-600/24" : "bg-neutral-950"} rounded-2xl border border-neutral-800 p-3 space-y-8 transition-colors hover:border-purple-600/60`}
                                          >
                                                <div className="flex items-start justify-between gap-4">
                                                      <div className="min-w-0 space-y-1">
                                                            <h3 className="text-base font-medium text-white">VVIP</h3>
                                                            <p className="text-xs font-normal text-neutral-400">Special Reservation</p>
                                                      </div>
                                                      <div className="shrink-0">
                                                            <h3 className="text-lg font-semibold text-orange-600">
                                                                  ₦{Number(event?.vvip_ticketPrice ?? 0).toLocaleString("en-NG")}
                                                            </h3>
                                                            <p className="text-xs font-normal text-neutral-400">2 left</p>
                                                      </div>
                                                </div>
                                                <div className="w-fit">
                                                      <div className="flex items-center gap-1">
                                                            <button
                                                                  type="button"
                                                                  aria-label="Decrease VVIP tickets"
                                                                  disabled={ticketQuantities.vvip === 0}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTicketQuantity("vvip", ticketQuantities.vvip - 1, 2);
                                                                  }}
                                                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  <FaMinus className="h-3 w-3" />
                                                            </button>
                                                            <span className="min-w-5 text-center text-sm font-medium text-white">{ticketQuantities.vvip}</span>
                                                            <button
                                                                  type="button"
                                                                  aria-label="Increase VVIP tickets"
                                                                  disabled={ticketQuantities.vvip >= 2}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTicketQuantity("vvip", ticketQuantities.vvip + 1, 2);
                                                                  }}
                                                                  className="flex h-6 w-6  items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                  <PiPlus />
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        <div className="w-full">
                              <div className="bg-neutral-950 py-6 rounded-2xl w-full">
                                    <div className="flex items-center justify-between border-b  border-neutral-925 px-4 pb-2">
                                          <p className="text-white text-sm">Order Summary</p>
                                    </div>
                                    <div className="p-4 pb-0">
                                          <div className="flex items-center gap-3 pb-3 border-b border-neutral-925">
                                                <img
                                                      src={event?.imageUrl}
                                                      alt={event?.eventTitle}
                                                      loading="lazy"
                                                      className="w-16 h-16 rounded-full object-cover"
                                                />

                                                <div className="flex flex-col">
                                                      <p className="text-white text-sm md:text-lg mb-1 font-medium">{event?.eventTitle}</p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2 mb-2">
                                                            <LocationIcon className="text-orange-600 w-4 h-4" /> {event?.venue}
                                                      </p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2">
                                                            <EventIcon className="text-orange-600 w-4 h-4" /> {event?.startDate} - {event?.startTime}
                                                      </p>
                                                </div>
                                          </div>
                                          {selectedItems.map((item) => (
                                                <div key={item.key} className="border-b border-neutral-925 flex items-center justify-between w-full pt-6 pb-2">
                                                      <div className="flex items-center gap-1">
                                                            <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">
                                                                  {item.label}
                                                            </div>
                                                            <span className="text-neutral-400 text-xs">×{item.quantity}</span>
                                                      </div>

                                                      <p className="text-white text-sm font-bold">₦{formatPrice(item.quantity * item.price)}</p>
                                                </div>
                                          ))}

                                          <div className="border-b border-neutral-925 flex items-center justify-between w-full pt-6 pb-2">
                                                <div className="flex items-center gap-1">
                                                      <span className="text-neutral-400 text-sm">Subtotal</span>
                                                </div>
                                                <p className="text-white text-sm font-bold">₦{formatPrice(subtotal)}</p>
                                          </div>

                                          <div className="flex items-center justify-between w-full mb-4 pt-6 pb-2">
                                                <div className="flex items-center gap-1">
                                                      <span className="text-white text-lg">Total</span>
                                                </div>
                                                <p className="text-orange-600 text-lg font-bold">₦{formatPrice(subtotal)}</p>
                                          </div>

                                          <Button variant="yellow" className="w-full" disabled={selectedItems.length === 0} onClick={onContinue}>
                                                Continue
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

import { Input } from "@/components/ui/input";

function ReviewTicket({ title, ticketQuantities, onBack }: { title: string; ticketQuantities: TicketQuantities; onBack: () => void }) {
      const event = Events.find((item) => item.eventTitle.replace(/\s+/g, "-").toLowerCase() === title.trim().toLowerCase());

      const [promoCode, setPromoCode] = useState("");
      const [isPromoApplied, setIsPromoApplied] = useState(false);

      const regularPrice = Number(event?.regular_ticketPrice ?? 0);
      const vipPrice = Number(event?.vip_ticketPrice ?? 0);
      const vvipPrice = Number(event?.vvip_ticketPrice ?? 0);

      const selectedItems = [
            { key: "regular", label: "Regular", quantity: ticketQuantities.regular, price: regularPrice },
            { key: "vip", label: "VIP", quantity: ticketQuantities.vip, price: vipPrice },
            { key: "vvip", label: "VVIP", quantity: ticketQuantities.vvip, price: vvipPrice },
      ].filter((item) => item.quantity > 0);

      const subtotal = selectedItems.reduce((total, item) => total + item.quantity * item.price, 0);

      const discountAmount = isPromoApplied ? subtotal * 0.2 : 0;
      const total = subtotal - discountAmount;

      const formatPrice = (amount: number) => amount.toLocaleString("en-NG");

      const applyPromoCode = () => {
            setIsPromoApplied(promoCode.trim().toUpperCase() === "TIXO20");
      };

      return (
            <div className="w-full">
                  <div className="flex items-start justify-between md:flex-nowrap flex-wrap gap-6">
                        <div className="space-y-4 w-full">
                              <div className="flex items-center bg-neutral-950 gap-3 p-4 rounded-2xl">
                                    <img src={event?.imageUrl} alt={event?.eventTitle} loading="lazy" className="w-16 h-16 rounded-full object-cover" />
                                    <div className="flex flex-col">
                                          <p className="text-white text-sm md:text-lg mb-1 font-medium">{event?.eventTitle}</p>
                                          <p className="text-neutral-400 text-xs flex items-center gap-2 mb-2">
                                                <LocationIcon className="text-orange-600 w-4 h-4" /> {event?.venue}
                                          </p>
                                          <p className="text-neutral-400 text-xs flex items-center gap-2">
                                                <EventIcon className="text-orange-600 w-4 h-4" /> {event?.startDate} - {event?.startTime}
                                          </p>
                                    </div>
                              </div>

                              <div className=" bg-neutral-950 space-y-6 p-4 rounded-2xl">
                                    <div className="flex items-center justify-between ">
                                          <h3 className="text-sm text-white">Your Tickets</h3>
                                          <Button
                                                onClick={() => {
                                                      onBack();
                                                }}
                                                type="button"
                                                variant="secondary"
                                                size={"sm"}
                                                className="text-xs gap-2 px-2  font-normal font-poppins"
                                          >
                                                <PlusIcon aria-hidden="true" className="h-4 w-4 text-purple-600" />
                                                Add Ticket
                                          </Button>
                                    </div>
                                    {selectedItems.map((item) => (
                                          <div key={item.key} className="w-full flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                      <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">
                                                            {item.label}
                                                      </div>
                                                      <span className="text-neutral-400 text-xs">×{item.quantity}</span>
                                                </div>

                                                <p className="text-white text-sm font-bold">₦{formatPrice(item.quantity * item.price)}</p>
                                          </div>
                                    ))}
                              </div>

                              <div className="bg-neutral-950 gap-3 p-4 rounded-2xl w-full">
                                    <h3 className="text-sm text-white mb-3">Promo Code</h3>
                                    <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                                          <Input
                                                type="text"
                                                placeholder="e.g TIXO20"
                                                value={promoCode}
                                                onChange={(event) => setPromoCode(event.target.value)}
                                                className="w-full min-w-0 flex-1 text-sm"
                                          />

                                          <Button
                                                variant="neutral"
                                                disabled={!promoCode.trim() || isPromoApplied}
                                                className={`w-full shrink-0 sm:w-auto ${isPromoApplied ? "bg-purple-600" : ""}`}
                                                onClick={applyPromoCode}
                                          >
                                                {isPromoApplied ? "Applied" : "Apply"}
                                          </Button>
                                    </div>
                                    {isPromoApplied && <p className="mt-1 text-sm text-green-600">TIXO20 — 20% discount applied!</p>}
                              </div>

                              <div className="flex items-center justify-between gap-x-3 gap-y-6 mt-6 w-full">
                                    <Button variant="neutral" className="w-full" onClick={onBack}>
                                          Back
                                    </Button>

                                    <Button variant="yellow" className="w-full" onClick={() => null}>
                                          Proceed to payment
                                    </Button>
                              </div>
                        </div>
                        <div className="w-full">
                              <div className="bg-neutral-950 py-6 rounded-2xl w-full">
                                    <div className=" border-b  border-neutral-925 px-4 pb-2">
                                          <p className="text-white text-sm">Order Summary</p>
                                    </div>
                                    <div className="p-4 pb-0">
                                          <div className="flex items-center gap-3 pb-3 border-b border-neutral-925">
                                                <img
                                                      src={event?.imageUrl}
                                                      alt={event?.eventTitle}
                                                      loading="lazy"
                                                      className="w-16 h-16 rounded-full object-cover"
                                                />

                                                <div className="flex flex-col">
                                                      <p className="text-white text-sm md:text-lg mb-1 font-medium">{event?.eventTitle}</p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2 mb-2">
                                                            <LocationIcon className="text-orange-600 w-4 h-4" /> {event?.venue}
                                                      </p>
                                                      <p className="text-neutral-400 text-xs flex items-center gap-2">
                                                            <EventIcon className="text-orange-600 w-4 h-4" /> {event?.startDate} - {event?.startTime}
                                                      </p>
                                                </div>
                                          </div>
                                          {selectedItems.map((item) => (
                                                <div key={item.key} className="border-b border-neutral-925 flex items-center justify-between w-full pt-6 pb-2">
                                                      <div className="flex items-center gap-1">
                                                            <div className="rounded-2xl bg-green-400/20 text-green-600/80 font-normal text-xs px-3 py-0.5">
                                                                  {item.label}
                                                            </div>
                                                            <span className="text-neutral-400 text-xs">×{item.quantity}</span>
                                                      </div>

                                                      <p className="text-white text-sm font-bold">₦{formatPrice(item.quantity * item.price)}</p>
                                                </div>
                                          ))}

                                          <div className="border-b border-neutral-925 space-y-4 w-full pt-6 pb-2">
                                                <div className="flex items-center justify-between">
                                                      <span className="text-neutral-400 text-sm">Subtotal</span>
                                                      <p className="text-white text-sm font-bold">₦{formatPrice(subtotal)}</p>
                                                </div>
                                                {isPromoApplied && (
                                                      <div className="flex items-center justify-between">
                                                            <span className="text-sm text-green-600">Promo Discount</span>
                                                            <p className="text-sm font-bold text-green-600">₦{formatPrice(discountAmount)}</p>
                                                      </div>
                                                )}
                                          </div>

                                          <div className="flex items-center justify-between w-full mb-4 pt-6 pb-2">
                                                <div className="flex items-center gap-1">
                                                      <span className="text-white text-lg">Total</span>
                                                </div>
                                                <p className="text-lg font-bold text-orange-600">₦{formatPrice(total)}</p>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
