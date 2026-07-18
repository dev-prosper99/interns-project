import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import discover from "@/assets/images/Discover.png";
const Discover = () => {
    return (
        <div>
        <Navbar/>

        

           <img src={discover} alt="hero" />
        
        <Footer/>

        
      </div>
    )
}
export default Discover;