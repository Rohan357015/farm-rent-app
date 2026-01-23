import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../store/authstore";

import { useEffect, useState } from "react";

import { Menu, X } from "lucide-react";
import AutoWeather from "../../components/weatherApp.jsx";
import MainDropDown from "../dashboard/MainDropDown.jsx";


import { useBookingStore } from "../../store/booking.store.js";


const FarmerNavabar = () => {


  const { getFarmerBookings } = useBookingStore();
  const { user, getFarmerDashboard } = useAuthStore();

  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
  if (user?.role === "farmer") {
    getFarmerDashboard();
  }
}, [user]);

useEffect(() => {
  if (user?.role !== "farmer") return;

  const loadBookings = async () => {
    try {
      const data = await getFarmerBookings();
      setBookings(data || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  loadBookings();
}, [user]);


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
    <>
      <nav className="w-full border border-gray-300 bg-white text-black h-[70px] flex items-center px-4 md:px-8 shadow-2xl">

        {/* LEFT: Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Menu button (always visible on mobile/tablet) */}
          <Menu
            onClick={() => setOpen(true)}
            className="text-black cursor-pointer"
          />

          {/* Logo */}
          <Link
           to={user.role === "farmer" ? "/farmer-dashboard" : "/supplier-dashboard"}
            className="text-2xl md:text-3xl font-bold"
          >
            🌽 AgroRent
          </Link>
        </div>

        {/* CENTER NAV LINKS (Desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-8 text-lg font-semibold">
            <li>
              <Link
                to={user.role === "farmer" ? "/farmer-dashboard" : "/supplier-dashboard"}
                className="hover:text-yellow-500 transition"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to={user.role === "farmer" ? "" : "/supplier-equipments"}
                className="hover:text-yellow-500 transition"
              >
                {user.role === "farmer" ? " Active Equipments" : "My Equipments"}
              </Link>
            </li>

            <li>
              <Link
                to={user.role === "farmer" ? "/farmer-bookings" : "/supplier-rentals"}
                className="hover:text-yellow-500 transition"
              >
                {user.role === "farmer" ? "My Bookings" : " Requested"}
              </Link>
            </li>
            <li>
              <Link
                to={user.role === "farmer" ? "/farmer-help" : "/supplier-help"}
                className="hover:text-yellow-500 transition"
              >
                Help
              </Link>
            </li>

            <li>
              <Link
                to={user.role === "farmer" ? "/farmer-chat" : "/supplier-earnings"}
                className="hover:text-yellow-500 transition"
              >
                {user.role === "farmer" ? "Chat" : " My Earnings"}
              </Link>
            </li>


          </ul>
        </div>

        {/* RIGHT ICONS */}
        <div className="ml-auto flex items-center gap-6">
          <Link to="/farmer-notifications">
            <FontAwesomeIcon
              icon={faBell}
              className="text-blue-950 text-xl md:text-2xl hover:text-yellow-600 transition"
            />
          </Link>

          <Link to={user.role === "farmer" ? "/farmer-profile" : "/supplier-profile"}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-blue-950 text-xl md:text-2xl hover:text-yellow-600 transition"
            />
          </Link>
        </div>
      </nav>


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
          className="
      fixed top-0 left-0 h-screen
      w-[55%] sm:w-[55%] md:w-[40%] lg:w-[20%] xl:w-[15%]
      bg-white text-black
      flex flex-col gap-8 overflow-y-auto
      z-50 shadow-xl
    "
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
    </>



  );
};

export default FarmerNavabar;
