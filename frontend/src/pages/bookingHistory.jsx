import React, { useMemo, useState } from "react";
import FarmerNavabar from "./dashboard/navBar2";
import { useBookingStore } from "../store/booking.store";
import { useNavigate } from "react-router-dom";


const statusBadge = {
    Pending: "text-yellow-700",
    Approved: "text-green-700",
    Completed: "text-blue-700",
    Rejected: "text-red-600",
    Cancelled: "text-orange-600",
};

export default function BookingHistory() {
    const navigate = useNavigate();
    const { requests } = useBookingStore();
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredHistory = useMemo(() => {
        if (statusFilter === "All") {
             return [...requests].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        }

        return requests.filter(
            (r) => r.status === statusFilter
        );
    }, [requests, statusFilter]);


    // 🔥 FULL HISTORY (ALL STATUS)
    

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const calculateDays = (start, end) =>
        Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

    return (
        <>

            
            <div className="min-h-screen bg-yellow-50 p-8 sm:p-6 lg:p-8">
                <div className="flex gap-20">
                
                <button className="text-black"
                >clear-history</button>
                </div>
                <h1 className="text-2xl font-bold text-green-700 mb-6">
                    Booking History
                </h1>

                {filteredHistory.length === 0 && (
                    <p className="text-center text-gray-500">
                        No booking history found
                    </p>
                )}

                <div className="flex gap-3 mb-6">
                    <button className="px-3 py-1 bg-gray-200  text-black rounded-md text-sm" onClick={() => setStatusFilter("All")}>
                        All
                    </button>

                    <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-sm" onClick={() => setStatusFilter("Approved")}>
                        Approved
                    </button>

                    <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-sm" onClick={() => setStatusFilter("Rejected")}>
                        Rejected
                    </button>

                    <button className="px-3 py-1 bg-gray-200 text-black rounded-md text-sm" onClick={() => setStatusFilter("Completed")}>
                        Completed
                    </button>
                </div>


                <div className="space-y-4">
                    {filteredHistory.map((r) => (
                        <div
                            key={r._id}
                            className="bg-white rounded-lg p-5 flex flex-col lg:flex-row justify-between gap-4 shadow-sm"
                        >
                            {/* FARMER */}
                            <div className="flex gap-4 items-center">
                                <img
                                    src={r.farmer?.image}
                                    alt=""
                                    className="h-12 w-12 rounded-full object-cover"
                                    onClick={() => navigate()}
                                />
                                <div>
                                    <p className="font-semibold">{r.farmer?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {r.farmer?.location || "Unknown location"}
                                    </p>
                                </div>
                            </div>

                            {/* PRODUCT */}
                            <div className="flex-1">
                                <p className="font-bold">{r.product?.equipmentName}</p>
                                <p className="text-xs text-gray-500">
                                    {r.product?.category}
                                </p>
                                <p className="text-sm text-black mt-1">
                                    {formatDate(r.startDate)} → {formatDate(r.endDate)} (
                                    {calculateDays(r.startDate, r.endDate)} days)
                                </p>
                            </div>

                            {/* PRICE */}
                            <div className="font-bold text-green-700">
                                ₹ {r.totalPrice?.toLocaleString("en-IN")}
                            </div>

                            {/* STATUS */}
                            <div className="text-right min-w-[140px]">
                                <p className={`text-sm font-medium ${statusBadge[r.status]}`}>
                                    ● {r.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
