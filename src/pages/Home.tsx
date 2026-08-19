import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

import EventDetail from "./EventDetail";

const Home = () => {
  return (
    <div>
      <Navbar />

      <EventDetail />
      <Footer />
    </div>
  );
};
export default Home;
