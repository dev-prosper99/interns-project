import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { CardTextValues } from "@/constants";
import { SmallCards } from "@/components/cards";
import EventDetail from "./EventDetail";
import ForgotPassword from "./Authentication/ForgotPassword";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-[#9EA0A91A] border border-purple-500 flex gap-32">
        {CardTextValues.map((values, index) => (
          <SmallCards
            cardNumber={index}
            cardHeader={values.header}
            cardText={values.text}
          />
        ))}
      </div> *
      <EventDetail />
      <ForgotPassword />
      <Footer />
    </div>
  );
};
export default Home;
