import { InstagramIcon, TiktokIcon, XIcon , FacebookIcon} from "@/assets/icons";
import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1d1e20] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 border-b border-neutral-600 pb-6 md:grid-cols-5 lg:gap-8">
          <div className="max-w-[240px]">
            <img src={logo} alt="Tix logo" className="mb-3 h-8 w-auto" />
            <p className="text-[14px] leading-5 text-neutral-300 sm:text-[11px]">
              Nigeria premier ticketing platform. Discover events, create
              unforgettable experiences, and connect communities, one ticket at
              a time.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-white">Company</h3>
            <ul className="space-y-2 text-[14px] text-neutral-300 sm:text-[11px]">
              <li>Home</li>
              <li>Discover</li>
              <li>About</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-white">Organizer</h3>
            <ul className="space-y-2 text-[14px] text-neutral-300 sm:text-[11px]">
              <li>Create an Event</li>
              <li>FAQ</li>
              <li>Help Center</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-white">
              Useful Links
            </h3>
            <ul className="space-y-2 text-[10px] text-neutral-300 sm:text-[11px]">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Cookie Setting</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-white">Contact</h3>
            <div className="space-y-2 text-[10px] leading-5 text-neutral-300 sm:text-[11px]">
              <p>14 Odumodu Maduw Ave, Victoria Island, Lagos, Nigeria</p>
              <p>+234 800 849 6588</p>
              <p>hello@tix.africa</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <a
              href="#"
              aria-label="Instagram"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>

            <a
              href="#"
              aria-label="X"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <XIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Tiktok"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <TiktokIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>

          <p className="text-[10px] text-neutral-300 sm:text-[11px]">
            © Tix 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
