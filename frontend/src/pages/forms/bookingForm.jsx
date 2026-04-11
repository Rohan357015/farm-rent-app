import React, { useState } from "react";
import { useAuthStore } from "../../store/authstore";
import { useProductStore } from "../../store/product.store";
import { useBookingStore } from "../../store/booking.store";
import { useNavigate } from "react-router-dom";

export default function BookingPage() {
  const { user } = useAuthStore();
  const { addBooking, checkAvailability } = useBookingStore();
  const { productDetails } = useProductStore();

  const [showSummary, setShowSummary] = useState(false);

  // Track availability check state for selected dates
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quantity: 1,
    operators: false,
    deliveryAndPickup: false,
    pickUpLocation: "",
    returnLocation: "",
    purpose: "",
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    location: user?.location || "",
  });

  const days =
    form.startDate && form.endDate
      ? Math.ceil(
          (new Date(form.endDate) - new Date(form.startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Reset availability whenever date changes
  const updateDate = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setAvailabilityInfo(null);
  };

  const handleCheckAvailability = async () => {
    if (!form.startDate || !form.endDate) {
      alert("Please select start date and end date first");
      return;
    }

    setCheckingAvailability(true);
    const result = await checkAvailability(productDetails?._id, form.startDate, form.endDate);
    setCheckingAvailability(false);
    setAvailabilityInfo(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productDetails?._id) {
      alert("Equipment details are still loading. Please try again.");
      return;
    }

    if (
      !form.startDate ||
      !form.endDate ||
      !form.fullName ||
      !form.pickUpLocation.trim() ||
      !form.returnLocation.trim() ||
      !form.purpose.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (days <= 0) {
      alert("End date must be after start date");
      return;
    }

    // Booking should only continue after successful availability check
    if (!availabilityInfo) {
      alert("Please check availability first");
      return;
    }

    if (!availabilityInfo.available) {
      alert("Selected dates are not available");
      return;
    }

    setShowSummary(true);
  };

  return (
    <div className="p-10 bg-gray-100 text-black w-full min-h-screen">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Booking Details</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 w-[80%] rounded-lg shadow space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Equipment Summary</h2>
          <div className="flex gap-4">
            <img src={productDetails?.images?.[0]} className="w-40 h-32 rounded object-cover" />
            <div>
              <h3 className="text-xl font-bold">{productDetails?.equipmentName}</h3>
              <p className="text-gray-600">{productDetails?.category}</p>
              <p className="text-green-700 font-bold text-lg mt-2">
                Rs {productDetails?.pricing?.dailyRate}/day
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-green-700">Rental Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Start Date *</label>
              <input
                type="date"
                className="w-full border border-black p-2 rounded"
                value={form.startDate}
                onChange={(e) => updateDate("startDate", e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold">End Date *</label>
              <input
                type="date"
                className="w-full border border-black p-2 rounded"
                value={form.endDate}
                onChange={(e) => updateDate("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={checkingAvailability}
            >
              {checkingAvailability ? "Checking..." : "Check Availability"}
            </button>

            {availabilityInfo?.available === true && (
              <p className="text-green-700 font-semibold">Available</p>
            )}

            {availabilityInfo?.available === false && (
              <p className="text-red-700 font-semibold">
                {availabilityInfo.message || "Already booked on selected dates"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label className="font-semibold">Pick Up Location *</label>
              <input
                type="text"
                className="w-full border border-black p-2 rounded"
                value={form.pickUpLocation}
                onChange={(e) => setForm({ ...form, pickUpLocation: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold">Return Location *</label>
              <input
                type="text"
                className="w-full border border-black p-2 rounded"
                value={form.returnLocation}
                onChange={(e) => setForm({ ...form, returnLocation: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="font-semibold">Quantity *</label>
            <input
              type="number"
              min="1"
              className="w-full border border-black p-2 rounded"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <p className="text-sm text-gray-600 mt-2">Duration: {days} days</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-green-700">Add-ons</h2>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={form.operators}
              onChange={() => setForm({ ...form, operators: !form.operators })}
            />
            Professional Operator ({productDetails?.operatorCharges}/day)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.deliveryAndPickup}
              onChange={() => setForm({ ...form, deliveryAndPickup: !form.deliveryAndPickup })}
            />
            Delivery + Pickup ({productDetails?.deliveryPrices}/day)
          </label>
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-sm font-semibold text-gray-700 mb-1">Purpose of Booking *</label>
          <textarea
            placeholder="Explain why you need this equipment..."
            className="border border-black p-3 rounded-lg w-full h-28 bg-gray-50"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          ></textarea>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-green-700">Farmer/Renter Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-black p-2 rounded"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border border-black p-2 rounded"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            className="border border-black p-2 rounded mt-4 w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Your Address"
            className="border border-black p-2 rounded mt-4 w-full"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded text-lg"
          disabled={availabilityInfo?.available === false}
        >
          Review Booking
        </button>
      </form>

      <SimpleSummaryModal
        open={showSummary}
        onClose={() => setShowSummary(false)}
        form={form}
        product={productDetails}
        days={days}
        user={user}
        addBooking={addBooking}
        availabilityInfo={availabilityInfo}
      />
    </div>
  );
}

function SimpleSummaryModal({ open, onClose, form, product, days, user, addBooking, availabilityInfo }) {
  const navigate = useNavigate();
  if (!open) return null;

  const rentalCost = (product?.pricing?.dailyRate || 0) * days * Number(form.quantity || 1);
  const operatorCost = form.operators ? (product?.operatorCharges || 0) * days : 0;
  const deliveryCost = form.deliveryAndPickup ? product?.deliveryPrices || 0 : 0;
  const total = rentalCost + operatorCost + deliveryCost;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white p-8 w-[600px] rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Booking Summary</h2>

        <p className="flex justify-between text-lg"><b>Equipment:</b><span>{product?.equipmentName}</span></p>
        <p className="flex justify-between text-lg"><b>Category:</b> <span>{product?.category}</span></p>
        <p className="flex justify-between text-lg"><b>Start:</b> <span>{form.startDate}</span></p>
        <p className="flex justify-between text-lg"><b>End:</b> <span>{form.endDate}</span></p>
        <p className="flex justify-between text-lg"><b>Days:</b> <span>{days}</span></p>
        <p className="flex justify-between text-lg"><b>Quantity:</b> <span>{form.quantity}</span></p>

        <hr className="my-4" />

        <p className="flex justify-between text-lg"><b>Operator:</b> <span>Rs {operatorCost}</span></p>
        <p className="flex justify-between text-lg"><b>Delivery:</b> <span>Rs {deliveryCost}</span></p>

        <hr className="my-4" />

        <p className="text-2xl font-bold text-green-700 text-right">Total: Rs {total}</p>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg text-lg">Cancel</button>

          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-lg"
            disabled={availabilityInfo?.available === false}
            onClick={async () => {
              const bookingPayload = {
                product: product?._id,
                farmer: user?._id,
                supplier: product?.supplier?._id || product?.supplier,
                startDate: form.startDate,
                endDate: form.endDate,
                pickUpLocation: form.pickUpLocation,
                returnLocation: form.returnLocation,
                purpose: form.purpose,
                operators: form.operators,
                deliveryAndPickup: form.deliveryAndPickup,
                totalPrice: total,
              };

              const result = await addBooking(product?._id, bookingPayload);

              if (result) {
                onClose();
                navigate("/farmer-dashboard");
                alert("Booking Successful");
              }
            }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
