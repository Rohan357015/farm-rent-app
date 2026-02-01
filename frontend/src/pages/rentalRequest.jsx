import React, { useEffect, useMemo } from "react";
import FarmerNavabar from "./dashboard/navBar2";
import { useBookingStore } from "../store/booking.store";
import BookingHistory from "./bookingHistory";
import { useNavigate } from "react-router-dom";

const statusBadge = {
  Pending: "text-yellow-700",
  Approved: "text-green-700",
  Completed: "text-green-700",
  Rejected: "text-red-600",
  Cancelled: "text-orange-600",
};

export default function RentalRequest() {
  const navigate = useNavigate();
  const[History,setHistory]=React.useState(false);
  const {
    getRequest,
    approveRequest,
    declineRequest,
    requests,
    loading,
  } = useBookingStore();

  useEffect(() => {
    getRequest();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const calculateDays = (start, end) =>
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

  // 🔥 MEMOIZED FILTER + SORT (NO SCROLL RESET)
  const pendingRequests = useMemo(() => {
    return [...requests]
      .filter((r) => r.status === "Pending")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [requests]);

  // 🔢 COUNTS (overall, not only pending)
  const approvedCount = useMemo(
    () => requests.filter((r) => r.status === "Approved").length,
    [requests]
  );

  const declinedCount = useMemo(
    () => requests.filter((r) => r.status === "Rejected").length,
    [requests]
  );

  

  if (loading) {
    return (
      <>
        <FarmerNavabar />
        <div className="p-10 text-center">Loading requests...</div>
      </>
    );
  }

  return (
    <>
      <FarmerNavabar />

      {History ? <BookingHistory /> :(
                 <div className="min-h-screen bg-yellow-50 p-8 sm:p-6 lg:p-8 overflow-x-hidden">
         <button className="p-2 px-5 text-black rounded-2xl absolute  shadow-md right-4 bg-yellow-300"
         onClick={()=>setHistory(!History)}

         >History</button>
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Rental Requests
        </h1>

       

        {/* COUNTS */}
        <div className="flex gap-6 mb-6 text-sm text-gray-700">
          <p>Approved: <b>{approvedCount}</b></p>
          <p>Declined: <b>{declinedCount}</b></p>
          <p>Total Requests: <b>{requests.length}</b></p>
        </div>

        {/* REQUEST LIST */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
          {pendingRequests.length === 0 && (
            <p className="text-center text-gray-500">
              No pending rental requests 🎉
            </p>
          )}

          {pendingRequests.map((r) => (
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

              {/* ACTIONS */}
              <div className="space-y-2 text-right min-w-[140px]">
                <p className={`text-sm font-medium ${statusBadge[r.status]}`}>
                  ● {r.status}
                </p>

                <button
                  className="w-full bg-green-700 text-white py-2 rounded text-sm"
                  onClick={() => approveRequest(r._id)}
                >
                  Approve
                </button>

                <button
                  className="w-full bg-red-700 text-white py-2 rounded text-sm"
                  onClick={() => declineRequest(r._id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      

     

    

     
          
    </>
  );
}
