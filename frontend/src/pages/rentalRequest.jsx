import React, { useEffect, useState } from "react";
import FarmerNavabar from "./dashboard/navBar2";
import { useBookingStore } from "../store/booking.store";

const statusBadge = {
  Pending: "text-yellow-700",
  Approved: "text-green-700",
  Completed: "text-green-700",
  Rejected: "text-red-600",
  Cancelled: "text-orange-600",
};

export default function RentalRequest() {
  const { getRequest,approveRequest,declineRequest } = useBookingStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getRequest();
        setRequests(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const calculateDays = (start, end) =>
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <>
        <FarmerNavabar />
        <div className="p-10 text-center">Loading requests...</div>
      </>
    );
  }
   const latestRequests = [...requests]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ;

  return (
    <>
      <FarmerNavabar />
      <div className="min-h-screen bg-yellow-50 p-8 sm:p-6 lg:p-8 overflow-x-hidden">
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          Rental Requests
        </h1>

        {/* Requests */}
       <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 overflow-x-hidden">

          {latestRequests.map((r) => (
            <div
              key={r._id}
             className="bg-gray-100 rounded-md shadow-sm lg:bg-white rounded-lg p-5 flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-start lg:items-center shadow-sm"

            >
              {/* Farmer */}
              <div className="flex gap-4 items-center  w-full lg:w-auto ">
                <div className="h-12 w-12 rounded-full   bg-green-700 flex items-center justify-center font-bold">
                  <img src={r.farmer?.image} alt="" className="rounded-full" />
                </div>
                <div>
                  <p className="font-semibold text-black">{r.farmer?.name}</p>
                  <p className="text-xs text-gray-500">
                    {r.farmer?.location || "Unknown location"}
                  </p>
                </div>
              </div>

              {/* Product */}
              <div className="w-full rounded-md p-4 flex gap-3 bg-white">
              <div className="w-full">
                <p className="font-bold text-black text-[1.1rem]">
                  {r.product?.equipmentName}
                </p>
                <p className="text-xs text-gray-500">
                  {r.product?.category}
                </p>
              </div>

              {/* Period */}
             <div className="text-sm text-black text-left lg:text-center w-full lg:w-auto">

                <p className="font-bold text-[1.1rem]">Rental Period</p>
                <p>
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </p>
                <p className="text-xs">
                  Total ({calculateDays(r.startDate, r.endDate)} days)
                </p>
              </div>

              {/* Price */}
              <div className="font-bold text-lg text-green-700 w-full lg:w-auto">

                ₹ {r.totalPrice?.toLocaleString("en-IN")}
              </div>
               </div>


              {/* Actions */}
              <div className="lg:ml-6 text-left lg:text-right space-y-2 w-full lg:w-auto">

                <p className={`text-sm font-medium ${statusBadge[r.status]}`}>
                  ● {r.status}
                </p>

                {r.status === "Pending" && (
                  <>
                    <button className="w-full bg-green-700 py-2 text-white px-4 py-1 rounded text-sm"
                    onClick={()=>{
                        approveRequest(r._id);
                    }}
                    >
                      Approve
                    </button>
                    <button className="w-full border px-4 py-2 bg-red-700 py-1 rounded text-sm"
                     onClick={()=>{
                        declineRequest(r._id);
                    }}
                    >
                      Decline
                    </button>
                  </>
                )}

                {r.status =="Approved" && (
                    <>
                    <p className="text-xl font-semibold text-gray-700 relative top-6">Approved By You</p>
                    </>
                )

                };
                {r.status =="Rejected" && (
                    <>
                    <p className="text-xl font-semibold text-gray-700 relative top-6">Declined By You</p>
                    </>
                )

                };

                {r.status !== "Pending" && (
                  <button className="w-full text-black mt-2 bg-gray-400 py-2 border px-4  rounded text-sm">
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
