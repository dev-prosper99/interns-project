import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../components/DashBoard/AttendeeDashboard/Sections/DashboardSections/DashboardStats";
import Upcoming from "../components/DashBoard/AttendeeDashboard/Sections/DashboardSections/Upcoming";
import SavedEventsPreview from "../components/DashBoard/AttendeeDashboard/Sections/DashboardSections/SavedEventsPreview";
import SuggestedEvents from "../components/DashBoard/AttendeeDashboard/Sections/DashboardSections/SuggestedEvents";
import ticketBackground from "@/assets/ticket.png";

const AttendeeDashboard = () => {
      const navigate = useNavigate();
      const firstName = (localStorage.getItem("firstName") || "there").trim().replace(/\s+/g, " ") || "there";

      return (
            <div className="min-w-0 bg-neutral-925 pb-10">
                  <div className="p-4 w-full ">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <p className="text-white sm:text-xl text-lg font-medium font-jakarta">Welcome, {firstName}👋</p>

                              <Button variant="yellow" className="md:w-auto w-1/2" onClick={() => navigate("/dashboard/attendee/events")}>
                                    Discover Events
                              </Button>
                        </div>
                  </div>

                  <div className="space-y-7 px-4 w-full mt-2">
                        <DashboardStats />

                        <div className="flex items-start justify-between gap-6 xl:flex-nowrap flex-wrap">
                              <Upcoming />
                              <SavedEventsPreview />
                        </div>

                        <div className="flex items-stretch justify-between gap-6 xl:flex-nowrap flex-wrap">
                              <SuggestedEvents />
                              <div
                                    className="bg-neutral-1000 py-8 rounded-2xl w-full px-4 space-y-10 flex flex-col bg-no-repeat"
                                    style={{
                                          backgroundImage: `url(${ticketBackground})`,
                                          backgroundPosition: "right bottom",
                                          backgroundSize: "75% 100%",
                                    }}
                              >
                                    <div className="space-y-16">
                                          <div className="">
                                                <p className="text-white text-2xl font-normal mb-2">Ready for your next experience?</p>
                                                <p className="text-white text-lg">Thousands of events are waiting for you across Nigeria</p>
                                          </div>

                                          <Button
                                                variant="yellow"
                                                className="self-start w-full md:w-auto"
                                                onClick={() => navigate("/dashboard/attendee/events")}
                                          >
                                                Discover Events
                                          </Button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default AttendeeDashboard;
