import { InstagramIcon, TiktokIcon, XIcon, FacebookIcon } from "@/assets/icons";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";

const footerItems = [
  {
    header: "Company",
    lists: ["Home", "Discover", "About", "Contact"],
  },
  {
    header: "Organizer",
    lists: ["Create an Event", "FAQ", "Help Center"],
  },
  {
    header: "Useful Links",
    lists: ["Privacy Policy", "Terms of Use", "Cookie Settings"],
  },
  {
    header: "Contact",
    lists: [
      "14 Ozumba Mbadiwe Ave, Victoria Island, Lagos, Nigeria",
      "+234 800 849 6588",
      "hello@tix.africa",
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#1d1e20] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 border-b border-neutral-600 pb-6 md:grid-cols-5 lg:gap-8">
          <div className="max-w-60">
            <img src={logo} alt="Tix logo" className="mb-3 h-8 w-auto" />
            <p className="text-[14px] leading-5 text-neutral-300 sm:text-[11px]">
              Nigeria premier ticketing platform. Discover events, create
              unforgettable experiences, and connect communities, one ticket at
              a time.
            </p>
          </div>

          {footerItems.map((items, index) => (
            <div key={index}>
              <h3 className="mb-3 text-sm font-medium text-white">
                {items.header}
              </h3>
              <ul className="space-y-2 text-[10px] text-neutral-300 sm:text-xs">
                {items.lists.map((listItem, index) => (
                  <li key={index}>{listItem}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="#"
              aria-label="Instagram"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <InstagramIcon className="h-5 w-5" />
            </Link>

            <Link
              to="#"
              aria-label="X"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <XIcon className="h-5 w-5" />
            </Link>
            <Link
              to="#"
              aria-label="Tiktok"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <TiktokIcon className="h-5 w-5" />
            </Link>
            <Link
              to="#"
              aria-label="Facebook"
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-500 text-neutral-300"
            >
              <FacebookIcon className="h-5 w-5" />
            </Link>
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
