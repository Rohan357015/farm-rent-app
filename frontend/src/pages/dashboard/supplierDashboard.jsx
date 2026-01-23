import React, { useEffect, useState } from "react";
import FarmerNavabar from "./navBar2.jsx";
import AutoWeather from "../../components/weatherApp.jsx";
import SupplierDropDown from "./supplierdropdown.jsx";
import DashboardCentre from "./dashboardcentre.jsx";
import { useAuthStore } from "../../store/authstore.js";
import { Menu, X } from "lucide-react";

const SupplierDashboard = () => {
  const { supplierStats, getSupplierDashboard, user } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
  if (user?.role === "supplier") {
    getSupplierDashboard();
  }
}, [user]);


  return (
    <div className="min-h-screen bg-[#12152D] text-white relative">
      {/* NAVBAR WITH MENU */}
      <FarmerNavabar onMenuClick={() => setOpen(true)} />

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* SIDEBAR (OVERLAY) */}
      {open && (
        <div
          className="fixed top-0 left-0 h-screen w-[18%] bg-white text-black
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
            <img
              src={user?.image}
              alt=""
              className="w-24 h-24 rounded-full border object-cover"
            />
            <h3 className="mt-2 font-semibold">{supplierStats?.name}</h3>
            <p className="text-gray-400 text-sm">{supplierStats?.location}</p>
            <p className="text-gray-400 text-sm">{supplierStats?.companyName}</p>
          </section>

          {/* STATS */}
          <section className="flex justify-around overflow-auto text-center font-serif">
            <div className="oveerflow-auto">
              <h2 className="text-green-700">{supplierStats?.totalRentals || 0}</h2>
              <p>Rentals</p>
            </div>
            <div>
              <h2 className="text-green-700">4.8</h2>
              <p>Ratings</p>
            </div>
            <div>
              <h2 className="text-green-700">{supplierStats?.active || 0}</h2>
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
            <SupplierDropDown />
          </section>
        </div>
      )}

      {/* MAIN CONTENT */}
      <section
        className="bg-yellow-50 text-black min-h-screen w-full
                   overflow-y-auto flex flex-col items-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <h1 className="mt-6 font-bold text-2xl">Owner Dashboard</h1>
        <DashboardCentre />
      </section>
    </div>
  );
};

export default SupplierDashboard;
