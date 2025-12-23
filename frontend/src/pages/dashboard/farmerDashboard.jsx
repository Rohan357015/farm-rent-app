import React, { useEffect, useState } from "react";
import FarmerNavabar from "./navBar2.jsx";
import { Menu, X } from "lucide-react";
import AutoWeather from "../../components/weatherApp.jsx";
import MainDropDown from "../dashboard/MainDropDown.jsx";
import { useAuthStore } from "../../store/authstore.js";
import EquipmentBrowser from "./featured.jsx";
import { useBookingStore } from "../../store/booking.store.js";

const FarmerDashboard = () => {
  const { getFarmerBookings } = useBookingStore();
  const { user, getFarmerDashboard } = useAuthStore();

  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getFarmerDashboard();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getFarmerBookings();
        setBookings(data || []);
      } catch (error) {
        console.error("Error loading bookings:", error);
      }
    };
    loadBookings();
  }, []);

  const activeRentals =
    bookings?.filter((b) => b.status === "Approved").length || 0;

  const avgRating =
    user?.ratings?.length > 0
      ? (
          user.ratings.reduce((sum, r) => sum + r.score, 0) /
          user.ratings.length
        ).toFixed(1)
      : "-";

  return (
    <div className="min-h-screen bg-[#12152D] text-white relative">
      <FarmerNavabar   onMenuClick={() => setOpen(true)}/>

      {/* DARK OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* SIDEBAR (OVERLAY) */}
      {open && (
        <div
          className="fixed top-0 left-0 h-screen w-[15%] bg-white text-black
                     flex flex-col gap-8 overflow-y-auto z-50 shadow-xl"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* CLOSE BUTTON */}
          <X
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 p-2 cursor-pointer
                       rounded-full hover:bg-gray-200 transition"
          />

          {/* PROFILE */}
          <section className="flex flex-col items-center mt-12">
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
              <img
                src={user?.image}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="mt-2 font-semibold">{user?.name}</h3>
            <p className="text-gray-400 text-sm">{user?.location}</p>
          </section>

          {/* STATS */}
          <section className="flex justify-around text-center font-serif">
            <div>
              <h2 className="text-green-700">{bookings.length}</h2>
              <p>Rentals</p>
            </div>
            <div>
              <h2 className="text-green-700">{avgRating}</h2>
              <p>Ratings</p>
            </div>
            <div>
              <h2 className="text-green-700">{activeRentals}</h2>
              <p>Active</p>
            </div>
          </section>

          {/* WEATHER */}
          <section className="px-3">
            <AutoWeather />
          </section>

          <hr className="border-gray-300" />

          {/* DROPDOWN */}
          <section className="px-3">
            <MainDropDown />
          </section>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="bg-yellow-50 text-black min-h-screen w-full
                      overflow-y-auto flex flex-col items-center relative"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        
        <EquipmentBrowser />
      </div>
    </div>
  );
};

export default FarmerDashboard;
