import React, { useEffect, useState } from "react";
import FarmerNavabar from "./dashboard/navBar2";
import { useBookingStore } from "../store/booking.store";
import { socket } from "../lib/socket";

const statusStyles = {
  Pending: {
    badge: "bg-yellow-100 text-yellow-800",
    border: "border-l-yellow-400",
  },
  Approved: {
    badge: "bg-green-600 text-white",
    border: "border-l-green-600",
  },
  Rejected: {
    badge: "bg-red-600 text-white",
    border: "border-l-red-600",
  },
  Completed: {
    badge: "bg-gray-500 text-white",
    border: "border-l-gray-400",
  },
  Cancelled: {
    badge: "bg-orange-100 text-orange-700",
    border: "border-l-orange-500",
  },
};

export default function FarmerBookings() {
  const { getFarmerBookings, cancelBookings, CompleteBookings } = useBookingStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Update one booking status in local list
  const updateBookingStatusInList = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id?.toString() === bookingId?.toString()
          ? { ...b, status }
          : b
      )
    );
  };

  // Load bookings once
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getFarmerBookings();
        setBookings(data || []);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Listen for realtime status updates
  useEffect(() => {
    const onStatusUpdated = ({ bookingId, status }) => {
      updateBookingStatusInList(bookingId, status);
    };

    socket.on("booking-updated", onStatusUpdated);
    socket.on("bookingStatusUpdated", onStatusUpdated);

    return () => {
      socket.off("booking-updated", onStatusUpdated);
      socket.off("bookingStatusUpdated", onStatusUpdated);
    };
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const updatedBooking = await cancelBookings(bookingId);
      updateBookingStatusInList(updatedBooking?._id, updatedBooking?.status);
    } catch (err) {
      console.error("Cancel failed");
    }
  };

  const statusCounts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Approved: bookings.filter((b) => b.status === "Approved").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
    Rejected: bookings.filter((b) => b.status === "Rejected").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  const filteredBookings =
    (filter === "All" ? bookings : bookings.filter((b) => b.status === filter)).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const showWarning = async (bookingId) => {
    if (window.confirm("Are you sure you want to complete this booking?")) {
      const updatedBooking = await CompleteBookings(bookingId);
      updateBookingStatusInList(updatedBooking?._id, updatedBooking?.status);
    }
  };

  if (loading) {
    return (
      <>
        <FarmerNavabar />
        <div className="min-h-screen bg-gray-50 p-8 text-center">
          <p className="text-xl text-gray-600">Loading bookings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FarmerNavabar />
      <div className="min-h-screen bg-yellow-50 p-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700">My Bookings</h1>
            <p className="text-gray-600 mt-1">Track and manage your equipment rentals</p>
          </div>
          <div className="rounded-lg border bg-white text-black px-4 py-2 text-sm font-medium">
            Total: {bookings.length} Bookings
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Pending", "Approved", "Completed", "Rejected", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                filter === status
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div className="text-center bg-white rounded-lg p-8">
            <p className="text-gray-600 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className={`flex rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition border-l-4 ${statusStyles[booking.status]?.border || "border-l-gray-400"}`}
              >
                <div className="w-40 flex items-center justify-center p-4">
                  <img
                    src={booking.product?.images?.[0] || "https://via.placeholder.com/150"}
                    alt={booking.product?.equipmentName}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.product?.equipmentName || "Equipment"}</h3>
                        <p className="text-xs uppercase tracking-wide text-gray-400">{booking.product?.category || "Category"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]?.badge || "bg-gray-100"}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                      <div>{calculateDays(booking.startDate, booking.endDate)} days</div>
                      <div>{booking.pickUpLocation}</div>
                      <div>{booking.returnLocation}</div>

                      <div className="col-span-2 mt-2 border-t pt-2 text-green-700 font-bold text-lg">
                        Rs {booking.totalPrice?.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    {booking.status === "Pending" && (
                      <button
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </button>
                    )}

                    {booking.status === "Completed" && (
                      <button className="rounded-md border border-green-600 px-3 py-1.5 text-sm text-green-700 hover:bg-green-50 font-medium">
                        Invoice
                      </button>
                    )}

                    {booking.status === "Rejected" && (
                      <button className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                        Support
                      </button>
                    )}

                    {booking.status === "Cancelled" && (
                      <span className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-700">
                        Booking Cancelled
                      </span>
                    )}

                    {booking.status === "Approved" && (
                      <button
                        className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                        onClick={() => showWarning(booking._id)}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
