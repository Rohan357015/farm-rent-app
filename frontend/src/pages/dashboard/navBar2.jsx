import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../store/authstore";
import { Menu } from "lucide-react";

const FarmerNavabar = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <nav className="w-full border border-gray-300 bg-white text-black h-[70px] flex items-center px-4 md:px-8 shadow-2xl">
      
      {/* LEFT: Menu + Logo */}
      <div className="flex items-center gap-3">
        {/* Menu button (always visible on mobile/tablet) */}
        <Menu
          onClick={onMenuClick}
          className="text-black cursor-pointer"
        />

        {/* Logo */}
        <Link
          to="/farmer-dashboard"
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
              Equipment
            </Link>
          </li>

          <li>
            <Link
              to={user.role === "farmer" ? "/farmer-bookings" : "/supplier-rentals"}
              className="hover:text-yellow-500 transition"
            >
              Rental
            </Link>
          </li>

          <li>
            <Link
              to={user.role === "farmer" ? "/farmer-earnings" : "/supplier-earnings"}
              className="hover:text-yellow-500 transition"
            >
              Earnings
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

        <Link to="/farmer-profile">
          <FontAwesomeIcon
            icon={faUser}
            className="text-blue-950 text-xl md:text-2xl hover:text-yellow-600 transition"
          />
        </Link>
      </div>
    </nav>
  );
};

export default FarmerNavabar;
