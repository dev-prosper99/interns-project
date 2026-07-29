import { Events } from "@/constants/events";
import { useState } from "react";
import partynight2 from "../assets/images/partynight2.png";
import { CalenderIcon, LocationIcon } from "@/assets/icons";
import location from "../assets/images/location.png";
import organizer from "../assets/images/organizer.jpg";
const EventDetail = ({ EventsIndex = 0 }) => {
  const events = Events[EventsIndex] ?? Events[0];
  const {
    eventTitle,
    eventCategory,
    venue,
    numberAttending,
    startDate,
    startTime,
    regular_ticketPrice,
    vip_ticketPrice,
    vvip_ticketPrice,
  } = events;
  const about = [
    "Get ready for the most electrifying night of the year. Afrobeats & Vibes Festival 2026 brings together Africa's hottest acts for one unforgettable evening of music, dance, and culture. From Afrobeats to Amapiano, Highlife to Afropop — every beat tells a story.",
    "Join thousands of music lovers under the stars at the iconic Eko Hotel grounds as we celebrate the global phenomenon that is African music. World-class production, celebrity appearances, and non-stop entertainment from 6pm till dawn.",
    "Featuring: Burna Boy, Davido,Tiwa Savage, Wizkid, Ayra Starr, and many surprise guests. Getready for the most electrifying night of the year. Afrobeats & Vibes Festival 2026 brings together Africa's hottest acts for one unforgettable evening of music, dance, and culture. From Afrobeats to Amapiano, Highlife to Afropop — every beat tells a story.",
    "Join thousands of music lovers under the stars at the iconic Eko Hotel grounds as we celebrate the global phenomenon that is African music. World-class production, celebrity appearances, and non-stop entertainment from 6pm till dawn. Featuring: Burna Boy, Davido, Tiwa Savage, Wizkid, Ayra Starr, and many surprise guests.",
  ];
    const [regularQty, setRegularQty] = useState(0);
    const [vipQty, setVipQty] = useState(0);
    const [vvipQty, setVvipQty] = useState(0);

  return (
    
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center gap-2 bg-neutral-925 py-5 px-4 sm:px-10 lg:px-24 xl:px-60">
        <p className="text-neutral-400 text-sm">Back</p>
        <span> / </span>
        <p className="text-white text-sm text-nowrap ">{eventTitle}</p>
      </div>
      <img src={partynight2} alt="" className="h-204 w-full lg:h-212.5 object-cover" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <div className="bg-neutral-500/24 border border-neutral-500/24 rounded-2xl py-6 px-5 sm:py-10 sm:px-8">
            <p className="font-bold text-[32px]">{eventTitle}</p>
            <div className="border border-neutral-500/24 bg-neutral-500/24 w-fit px-4 py-2 rounded-4xl mt-3">
              <p className="text-xs">{eventCategory}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-orange-500/24 border-orange-500/24 ">
                  <LocationIcon />
                </div>
                <div>
                  <p className="text-sm">Venue</p>
                  <p className="font-medium">{venue}</p>
                  <p className="text-orange-500">View on map</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-orange-500/24 border-orange-500/24 ">
                  <CalenderIcon />
                </div>
                <div>
                  <p className="text-sm">Date & Time</p>
                  <p className="font-medium">
                    {startDate} {startTime}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-orange-500/24 border-orange-500/24 ">
                  <LocationIcon />
                </div>
                <div>
                  <p className="text-sm">Attendance</p>
                  <p className="font-medium">{numberAttending} Attending</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-neutral-500/24 border border-neutral-500/24 rounded-2xl py-10 px-8 sm:py-10 sm:px-8">
            <p className="text-2xl">About Event</p>
            <div className="text-md pt-3 space-y-4">
              {about.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
          </div>
          <div className="bg-neutral-500/24 border border-neutral-500/24 rounded-2xl py-10 px-8 sm:py-10 sm:px-8">
            <p>Location</p>
            <img src={location} alt="" className="w-221.25 h-117.75 lg:h-117.5 sm:h-72"/>
          </div>
          <div className="bg-neutral-500/24 border border-neutral-500/24 rounded-2xl py-10 px-8 sm:py-10 sm:px-8">
            <p className="text-2xl">Organizer</p>
            <div className="flex items-center gap-3 mt-3">
              <img src={organizer} className="w-15 h-15 rounded-full " />
              <div>
                <p className="text-sm font-medium flex items-center gap-1">
                Michael Events
              </p>
              <p className="text-md">Verified Event Organizer</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-500/24 lg:sticky lg:top-6 p-6 rounded-2xl">
            <p className="text-2xl">Select Ticket</p>
            <p className="text-neutral-400 text-sm mt-1">3 ticket types available</p>
          <div className="flex flex-col gap-4 mt-6">
            <div className="border border-neutral-500/24 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Regular</p>
                  <p className="text-sm text-neutral-400">Regular Sitting Area</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-medium">₦{Number(regular_ticketPrice).toLocaleString()}</p>
                  <p className="text-xs text-neutral-400">230 left</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setRegularQty((q) => Math.max(0, q - 1))} className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center"> −</button>
                <span className="w-4 text-center">{regularQty}</span>
                <button onClick={() => setRegularQty((q) => q + 1)} className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"> + </button>
              </div>
            </div>
            <div className="border border-neutral-500/24 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">VIP</p>
                  <p className="text-sm text-neutral-400">Best Experiece</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-medium">₦{Number(vip_ticketPrice).toLocaleString()}</p>
                  <p className="text-xs text-neutral-400">40 left</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setVipQty((q) => Math.max(0, q - 1))} className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center"> −</button>
                <span className="w-4 text-center">{vipQty}</span>
                <button onClick={() => setVipQty((q) => q + 1)} className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"> + </button>
              </div>
            </div>
            <div className="border border-neutral-500/24 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">VVIP</p>
                  <p className="text-sm text-neutral-400">Regular Sitting Area</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-medium">₦{Number(vvip_ticketPrice).toLocaleString()}</p>
                  <p className="text-xs text-neutral-400">2 left</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => setVvipQty((q) => Math.max(0, q - 1))} className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center"> −</button>
                <span className="w-4 text-center">{vvipQty}</span>
                <button onClick={() => setVvipQty((q) => q + 1)} className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"> + </button>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-3 rounded-lg bg-neutral-700 text-neutral-400 font-medium">
            Login to Continue
          </button>
        </div>
      </div>
    </div>
);
};
export default EventDetail;
