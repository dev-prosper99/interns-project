import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/HomePage/Hero";
import UpcomingEvents from "@/components/HomePage/UpcomingEvents";
import EventsNearYou from "@/components/HomePage/EventsNearYou";
import BuiltForNigerians from "@/components/HomePage/BuiltForNigerians";
import OrganizerPitch from "@/components/HomePage/OrganizerPitch";
import Testimonials from "@/components/HomePage/Testimonials";
import StatsBar from "@/components/HomePage/StatsBar";
import TicketSteps from "@/components/HomePage/TicketSteps";
import Newsletter from "@/components/HomePage/NewsLetter";
import CtaBanner from "@/components/HomePage/CtaBanner";
 

import EventDetail from "./EventDetail";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <StatsBar />
      <UpcomingEvents />
      <TicketSteps />
      <EventsNearYou />
      <BuiltForNigerians />
      <OrganizerPitch />    
      <Testimonials />
      <Newsletter />
      <CtaBanner />
      <Footer />
    </div>
  );
};
 
export default Home;