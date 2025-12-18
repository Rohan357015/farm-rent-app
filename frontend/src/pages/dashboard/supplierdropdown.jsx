import React, { useState } from "react";
import { ChevronDown ,LogOut,HelpCircle,User ,Calendar ,Wallet,Search,Stars,Tractor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authstore.js";


const SupplierDropDown = () => {
    const [open, setOpen] = useState(true);
    const [open2, setOpen2] = useState(true);
    const supplierLogout = useAuthStore((state) => state.supplierLogout);
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
                                onClick={() => navigate("/supplier-equipments")}
                            >
                              <Tractor className="inline-block mr-2" /> My Equipments
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/supplier-rentals")}
                            >
                               <Calendar className="inline-block mr-2" /> Rental Request
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/supplier-payments")}
                            >
                               <Wallet className="inline-block mr-2" /> Earnings
                            </a>
                        </li>
                        <li>
                            <a
                                className="block p-3 pl-10 hover:bg-gray-400 rounded"
                                onClick={() => navigate("/supplier-review-ratings")}
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
                                onClick={() => navigate("/supplier-profile")}
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
                                onClick={() =>{  supplierLogout() ; navigate("/supplier-login")} }
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

export default SupplierDropDown;
