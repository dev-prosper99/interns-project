import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { EventCard } from "@/components/cards/EventCard";
import { SmallCards } from "@/components/cards";
import { Events } from "@/constants/events";
import event1 from "@/assets/event-1.png";
import event2 from "@/assets/event-2.png";
import event3 from "@/assets/event-3.png";
import event4 from "@/assets/event-4.png";
import event5 from "@/assets/event-5.png";
import event6 from "@/assets/event-6.png";
import { Icon6ChevronRight, SearchIcon } from "@/assets/icons";
import { Icon5ChevronLeft } from "@/assets/icons";
import organizerImg from "@/assets/organizer.png"
import {Icon1, Icon2, Icon3, Icon4, Icon7, Icon8, Icon9, Icon10, Icon11, Icon12, Icon13} from "@/assets/icons";

const images = [event1, event2, event3, event4, event5, event6];

function Hero() {
  return (
    <div className="relative min-h-screen bg-cover bg-center flex flex-col  items-center justify-center text-center bg-[url('/src/assets/hero-bg.png')]">
      <div className="pt-20 pb-12 sm:pb-20 px:6 min-h-screen z-10 w-full h-full flex flex-col items-center justify-center gap-6 px-4 md:px-0 bg-linear-to-b from-[rgba(63,15,145,0.48)] to-[rgba(16,2,39,0.8)]">
        {/* Badge */}
        <div className=" flex items-center gap-2 border border-neutral-400 rounded-full px-3 py-3 text-neutral-50 text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <p>Over 14,000 events live across Nigeria</p>
        </div>

        <div className="max-w-310 flex flex-col gap-6 items-center justify-center">
          <h1 className="font-jakarta text-white text-4xl lg:text-6xl font-extrabold leading-11 lg:leading-19.75">
            Every Event Deserves a Full House.
          </h1>

          <p className="text-neutral-50 text-lg text-center max-w-285 font-medium leading-7">
            Discover, attend, and manage unforgettable events across Nigeria.
            From stadium concerts to intimate workshops — TixO is where it all
            begins.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-between w-full max-w-153.25 bg-neutral-100 rounded-[10px] py-3 px-4">
          <div className="flex items-center gap-2 flex-1">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-[10px] py-2 px-6">
            Search
          </button>
        </div>

        {/* Popular categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-white text-sm self-center mr-1">Popular:</span>
          {["Tech", "Comedy", "Music", "Comedy", "Sports"].map((cat, i) => (
            <span
              key={i}
              className="bg-white/10 text-white text-xs px-4 py-1.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsBar() {
  const stats = [
    { Icon: Icon1, label: "Tickets Sold", value: "2M+" },
    { Icon: Icon2, label: "Events", value: "10,000+" },
    { Icon: Icon3, label: "Organizers", value: "2,000+" },
    { Icon: Icon4, label: "Happy Attendees", value: "98%" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 bg-neutral-925 py-8 gap-4 text-center">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-2">
          <s.Icon className="w-12 h-12" />
          <p className="text-white text-2xl font-bold">{s.value}</p>
          <p className="text-neutral-400 text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        <p className="text-neutral-400 text-sm mt-1">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <button className="w-12.5 h-12.5 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800">
          <Icon5ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button className="w-12.5 h-12.5 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800">
          <Icon6ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

function TicketSteps() {
  const steps = [
    {
      header: "Discover Your Event",
      text: "Browse thousands of events across music, tech, food, sports, and more. Filter by city, date, or price to find your perfect match.",
    },
    {
      header: "Choose & Checkout",
      text: "Select your ticket type and quantity, apply a promo code if you have one, then complete your secure payment in seconds.",
    },
    {
      header: "Arrive & Enjoy",
      text: "Your QR code lands in your inbox instantly. At the gate, just scan and walk in. No printouts, no hassle.",
    },
  ];
  return (
    <div className="bg-neutral-950 py-16 px-6 md:px-30 ">
      <h2 className="text-white text-2xl font-bold mb-2">
        Your ticket in 3 simple steps
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        No complicated processes, no long queues. TixO makes getting into your
        favourite events effortless.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <SmallCards
            key={i}
            cardNumber={i + 1}
            cardHeader={s.header}
            cardText={s.text}
          />
        ))}
      </div>
    </div>
  );
}

function BuiltForNigerians() {
  const features = [
    {
      icon: Icon7,
      header: "Instant Ticket Delivery",
      text: "Receive your tickets instantly via email with a unique QR code — no printing, no waiting, no stress.",
    },
    {
      icon: Icon8,
      header: "Safe & Secure Payments",
      text: "Every transaction is protected with bank-grade encryption. We support Paystack, Stripe, bank transfers, and USSD.",
    },
    {
      icon: Icon9,
      header: "Events Across Nigeria",
      text: "From Lagos to Abuja, Ibadan to Jos — discover what's happening in your city and beyond.",
    },
  ];
  return (
    <div className="bg-neutral-950 py-16 px-6 md:px-30">
      <h2 className="text-white text-2xl font-bold mb-2">
        Built for Nigerians, loved globally
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        TixO was designed from the ground up for the realities of Nigerian
        event-going and organizing.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <SmallCards
            key={i}
            icon={f.icon}
            cardHeader={f.header}
            cardText={f.text}
          />
        ))}
      </div>
    </div>
  );
}

function OrganizerPitch() {
  const bullets = [
    "Sell unlimited ticket types (Free, Paid, VIP)",
    "Real-time sales analytics and revenue tracking",
    "QR code scanning for seamless event entry",
    "Export attendee lists and transaction reports",
    "Promo codes and group discount management",
  ];
  return (
    <div className="bg-purple-900 py-16 px-6 md:px-30 flex flex-col md:flex-row items-center gap-10">
      <div className="flex flex-col gap-6 items-start lg:w-1/2 px-4 sm:px-0">
        <span className="inline-flex items-center rounded-full border border-[#9EA0A9]/24 px-3 py-3 text-sm text-neutral-300 w-fit">
          For Event Organisers
        </span>
        <h2 className="font-jarkarta font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[52px]leading-tight lg-leading-14 tracking-[-0.02em]">
          Sell more tickets. Stress less.
        </h2>
        <p className="font-poppins font-medium text-sm sm:text-base leading-6 text-neutral-100">
          From intimate workshops to stadium concerts, TixO gives you everything
          you need to create, sell, and manage events with confidence.
        </p>
        <ul className="flex flex-col gap-4 w-full">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex flex-row items-center gap-2 text-neutral-200 text-sm">
              <Icon10 className="w-5 h-5 shrink-0"/>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <button className="bg-purple-500 hover:bg-purple-800 text-neutral-200 px-6 py-3 rounded-lg font-medium">
          Get Started
        </button>
      </div>
      <div className="relative w-70 sm:w-100 md:-140 lg:w-145 aspect-680/548 rounded-2xl bg-neutral-900 overflow-hidden shrink-0 mx-auto lg:mx-0">
        <img
          src={organizerImg}
          alt="TixO organizer dashboard"
          className="absolute rounded-2xl shadow-lg"
          style={{ top: "11.3%", left: "11.3%", width: "127.6%", height: "111.9%" }}
        />
      </div>
    </div>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Kemi Adeyemi",
      role: "Event Organiser, Lagos",
      text: "TixO transformed how I run my events. The analytics dashboard is incredible — I can see sales in real time.",
    },
    {
      name: "Emeka Nwosu",
      role: "Music Lover, Lagos",
      text: "I've used every ticketing platform in Nigeria. TixO is hands down the clearest experience.",
    },
    {
      name: "Hassan Aliyah",
      role: "Tech Conference Organiser, Lagos",
      text: "We hosted TechFest Lagos on TixO and the results were phenomenal. Sold out in 48 hours.",
    },
  ];
  return (
    <div className="bg-neutral-950 py-16 px-6 md:px-30">
      <h2 className="text-white text-2xl font-bold mb-2">
        What people are saying about us
      </h2>
      <p className="text-neutral-400 text-sm mb-8">
        Event Organisers and attendees love using TixO.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="bg-purple-900/40 rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex gap-1">
             {Array.from({ length: 5 }).map((_, i) => (
              <Icon11 key={i} className="w-3.5 h-3.5 -mx-1" />
            ))}
            </div>
            <p className="text-neutral-200 text-sm">"{r.text}"</p>
            <div>
              <p className="text-white text-sm font-medium">{r.name}</p>
              <p className="text-neutral-400 text-xs">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaBanner() {
  return (
    <div
      className="relative h-100 bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: `url(/src/assets/backview.jpg)` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h2 className="text-white text-3xl font-bold">
          Ready to create your first event?
        </h2>
        <p className="text-neutral-200 text-sm">
          Join thousands of event organizers already selling tickets with TixO
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-purple-600 hover:bg-[#6D28D9] text-white px-6 py-3 rounded-lg font-medium">
            Get Started
          </button>
          <button className="bg-neutral-500 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium border border-white/30">
            Discover Events
          </button>
        </div>
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div className="relative bg-purple-500 py-16 px-6 w-full flex justify-center overflow-hidden">
      <Icon12
        className="absolute pointer-events-none"
        style={{
          width: "34%",
          aspectRatio: "1",
          top: "-30%",
          left: "-5%",
          transform: "rotate(15deg)",
          opacity: 0.6,
        }}
      />
      <Icon13
        className="absolute pointer-events-none"
        style={{
          width: "34%",
          aspectRatio: "1",
          top: "-50%",
          right: "-5%",
          transform: "rotate(15deg)",
          opacity: 0.6,
        }}
      />
 
      <div className="relative z-10 bg-neutral-950 rounded-xl p-8 max-w-lg w-full text-center flex flex-col gap-4">
        <h3 className="text-white text-xl font-bold">
          Never miss an event again
        </h3>
        <p className="text-neutral-400 text-sm">
          Get weekly roundups of the best events in your city, exclusive
          early-bird access, and promo codes — straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            className="bg-neutral-900 w-full rounded-lg px-4 py-3 text-sm outline-none"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
 

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <StatsBar />

      <div className="pl-6 md:pl-30 py-16 bg-neutral-950">
        <div className="pr-6 md:pr-30">
        <SectionHeader
         title="Upcoming Events"
         subtitle="Don't miss upcoming events"
          />
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
          {Events.slice(0, 20).map((event, i) => (
            <div key={i} >
              <EventCard
                key={i}
                imageUrl={images[i % images.length]}
                {...event}
              />
            </div>
          ))}
        </div>
      </div>

      <TicketSteps />

      <div className="pl-6 md:pl-30 py-16 bg-neutral-950">
        <div className="pr-6 md:pr-30">
        <SectionHeader
         title="Events Near you"
         subtitle="Don't miss what's happening near you"
          />
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2">
          {Events.slice(0, 20).map((event, i) => (
            <div key={i} >
              <EventCard
                key={i}
                imageUrl={images[i % images.length]}
                {...event}
              />
            </div>
          ))}
        </div>
      </div>

      <BuiltForNigerians />
      <OrganizerPitch />
      <Testimonials />
      <CtaBanner />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
