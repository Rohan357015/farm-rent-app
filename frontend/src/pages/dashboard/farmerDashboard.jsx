import React, { useEffect, useState } from "react";
import FarmerNavabar from "./navBar2.jsx";
import { Menu, X } from "lucide-react";
import AutoWeather from "../../components/weatherApp.jsx";
import MainDropDown from "../dashboard/MainDropDown.jsx";
import { useAuthStore } from "../../store/authstore.js";
import EquipmentBrowser from "./featured.jsx";
import { useBookingStore } from "../../store/booking.store.js";

const FarmerDashboard = () => {
  // const { getFarmerBookings } = useBookingStore();
  // const { user, getFarmerDashboard } = useAuthStore();

  // const [bookings, setBookings] = useState([]);
  // const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   getFarmerDashboard();
  // }, []);

  // useEffect(() => {
  //   const loadBookings = async () => {
  //     try {
  //       const data = await getFarmerBookings();
  //       setBookings(data || []);
  //     } catch (error) {
  //       console.error("Error loading bookings:", error);
  //     }
  //   };
  //   loadBookings();
  // }, []);

  // const activeRentals =
  //   bookings?.filter((b) => b.status === "Approved").length || 0;

  // const avgRating =
  //   user?.ratings?.length > 0
  //     ? (
  //         user.ratings.reduce((sum, r) => sum + r.score, 0) /
  //         user.ratings.length
  //       ).toFixed(1)
  //     : "-";

  return (
    <div className="min-h-screen bg-[#12152D] text-white relative">
      <FarmerNavabar/>

      {/* DARK OVERLAY */}
    
        {/* // <div
        //   onClick={() => setOpen(false)}
        //   className="fixed inset-0 bg-black/40 z-40"
        // /> */}
     

      {/* SIDEBAR (OVERLAY) */}
      
  
      

      
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
