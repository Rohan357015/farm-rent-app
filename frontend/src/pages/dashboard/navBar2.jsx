import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../store/authstore";
import { SearchResult } from "../searchresult.jsx";

import { useEffect, useState, useMemo } from "react";

import { Menu, X, Plug, MessageSquare, RadioTower, Search } from "lucide-react";
import AutoWeather from "../../components/weatherApp.jsx";
import MainDropDown from "../dashboard/MainDropDown.jsx";


import { useBookingStore } from "../../store/booking.store.js";
import { useProductStore } from "../../store/product.store.js";


const FarmerNavabar = () => {
  const [search, setSearch] = useState("");
  const { products, fetchProducts } = useProductStore();
  const [showResults, setShowResults] = useState(false);



  const { getFarmerBookings } = useBookingStore();
  const { user, allUser, fetchAllUsers, getFarmerDashboard } = useAuthStore();

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


  const [searchType, setSearchType] = useState("users");

  useEffect(() => {
    fetchAllUsers();
    console.log("All users fetched:", allUser);
  }, []);


  const filteredResults = useMemo(() => {
    if (!search.trim()) {
      return { products: [], users: [] };
    }

    const searchLower = search.toLowerCase();

    let filteredProducts = [];
    let filteredUsers = [];

    if (searchType === "products") {
      filteredProducts = products.filter((item) =>
        item.equipmentName?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.model?.toLowerCase().includes(searchLower)
      );
    }

    if (searchType === "users") {
      filteredUsers = allUser.filter((u) =>
        u.name?.toLowerCase().includes(searchLower)
      );
    }

    return {
      products: filteredProducts,
      users: filteredUsers,
    };
  }, [search, searchType, products, allUser]);


  // useEffect(() => {
  //   if (searchType !== "users") return;

  //   const delay = setTimeout(() => {
  //     if (search.trim() !== "") {
  //       AllUser(search);
  //     }
  //   }, 100);

  //   return () => clearTimeout(delay);

  // }, [search, searchType]);








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
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">

                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 outline-none border-none"
                >
                  <option value="users">Users</option>
                  <option value="products">Products</option>
                </select>

                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 w-64 outline-none border-none"
                />

              </div>




            </li>


            <li>
              <Link
                to={user.role === "farmer" ? "/connections" : "/connections"}
                className="hover:text-yellow-500 transition"
              >
                <RadioTower className="w-6 h-6 inline mr-1" /> My Network
              </Link>
            </li>

            <li>
              <Link
                to={"/user/message"}
                className="hover:text-yellow-500 transition"
              >
                <MessageSquare className="w-6 h-6 inline mr-1" /> {user.role === "farmer" ? "Chat" : "Chat"}
              </Link>
            </li>


          </ul>
        </div>

        {search.trim() && (
          (searchType === "products" && filteredResults.products.length > 0) ||
          (searchType === "users" && filteredResults.users.length > 0)
        ) && (
            <div
              className="
      absolute top-[75px] left-1/2 -translate-x-1/2
      w-[32rem]
      bg-white
      shadow-2xl
      rounded-2xl
      border border-gray-200
      z-50
      animate-fadeIn
    "
            >
              <div
                className="
        max-h-80
        overflow-y-auto
        px-4 py-3
        scrollbar-hide
      "
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none"
                }}
              >
                <SearchResult
                  data={filteredResults}
                  searchType={searchType}
                />
              </div>
            </div>
          )}




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
