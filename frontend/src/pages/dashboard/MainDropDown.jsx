import React, { useState } from "react";
import { ChevronDown ,LogOut,HelpCircle,User ,Home ,Wallet,Search,Stars,ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authstore.js";

const MainDropDown = () => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const farmerLogout = useAuthStore((state) => state.farmerLogout);
    const navigate = useNavigate();

    return (
        <>
            {/* FIRST DROPDOWN */}
            <ul className="w-full">
                <li>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-between w-full px-10 py-2 bg-green-100 rounded"
                    >
                        <span className="font-semibold">Dashboard</span>
                        <ChevronDown
                            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                    </button>
                </li>

                {open && (
                    <ul className="flex flex-col gap-5 font-semibold">
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/browse-equipments")}
                            >
                              <Search className="inline-block mr-2" /> Browse Equipment
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/farmer-bookings")}
                            >
                               <Home className="inline-block mr-2" /> My Rentals
                            </a>
                        </li>
                         <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/cart")}
                            >
                               <ShoppingCart className="inline-block mr-2" /> Cart
                            </a>
                        </li>
                        
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/payments")}
                            >
                               <Wallet className="inline-block mr-2" /> Payments
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/review-ratings")}
                            >
                               <Stars className="inline-block mr-2" /> Review & Ratings
                            </a>
                        </li>
                    </ul>
                )}
            </ul>

            {/* SECOND DROPDOWN */}
            <ul className="w-full mt-5">
                <li>
                    <button
                        onClick={() => setOpen2(!open2)}
                        className="flex items-center justify-between w-full px-10 py-2 bg-green-100 rounded"
                    >
                        <span className="font-semibold">Account</span>
                        <ChevronDown
                            className={`transition-transform duration-200 ${open2 ? "rotate-180" : ""}`}
                        />
                    </button>
                </li>

                {open2 && (
                    <ul className="flex flex-col gap-5 font-semibold">
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/farmer-profile")}
                            >
                              <User className="inline-block mr-2" /> Profile Settings
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/help-support")}
                            >
                               <HelpCircle className="inline-block mr-2" /> Help & Support
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() =>{ farmerLogout()  ; navigate("/farmer-login")} }
                            >
                                <LogOut className="inline-block mr-2" /> Logout
                            </a>
                        </li>
                    </ul>
                )}
            </ul>
        </>
    );
};

export default MainDropDown;
