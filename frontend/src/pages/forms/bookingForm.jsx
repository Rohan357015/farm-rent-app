import React, { useState } from "react";
import { useAuthStore } from "../../store/authstore";
import { useProductStore } from "../../store/product.store";
import { useBookingStore } from "../../store/booking.store";
import { useNavigate } from "react-router-dom";

export default function BookingPage() {
  const { user } = useAuthStore();
  const { addBooking } = useBookingStore();
  const { productDetails } = useProductStore();

  const [showSummary, setShowSummary] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate || !form.fullName) {
      alert("Please fill all required fields");
      return;
    }

    setShowSummary(true);
  };

  return (
    <div className="p-10 bg-gray-100 text-black w-full min-h-screen">

      <h1 className="text-3xl font-bold text-green-900 mb-6">Booking Details</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 w-[80%] rounded-lg shadow space-y-6">

        {/* Equipment Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Equipment Summary</h2>
          <div className="flex gap-4">
            <img
              src={productDetails?.images?.[0]}
              className="w-40 h-32 rounded object-cover"
            />
            <div>
              <h3 className="text-xl font-bold">{productDetails.equipmentName}</h3>
              <p className="text-gray-600">{productDetails.category}</p>
              <p className="text-green-700 font-bold text-lg mt-2">
                ₹{productDetails.pricing.dailyRate}/day
              </p>
            </div>
          </div>
        </div>

        {/* Rental Details */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-green-700">Rental Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Start Date *</label>
              <input
                type="date"
                className="w-full border border-black p-2 rounded"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold">End Date *</label>
              <input
                type="date"
                className="w-full border border-black p-2 rounded"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label className="font-semibold">pick Up Location *</label>
              <input
                type="text"
                className="w-full border border-black p-2 rounded"
                value={form.pickUpLocation}
                onChange={(e) => setForm({ ...form, pickUpLocation: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold">returnLocation *</label>
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

        {/* Add-ons */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-green-700">Add-ons</h2>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={form.operators}
              onChange={() => setForm({ ...form, operators: !form.operators })}
            />
            Professional Operator ({productDetails.operatorCharges}/day)
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.delivery}
              onChange={() => setForm({ ...form, deliveryAndPickup: !form.deliveryAndPickup })}
            />
            Delivery + Pickup ({productDetails.deliveryPrices}/day)
          </label>
        </div>

        <div className="flex flex-col mt-4">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Purpose of Booking *
          </label>

          <textarea
            placeholder="Explain why you need this equipment..."
            className="
              border border-black 
               p-3 
               rounded-lg 
               w-full 
               h-28 
               bg-gray-50 
               focus:outline-none 
               focus:ring-2 
                focus:ring-black
                focus:border-transparent 
                 transition 
               placeholder-gray-400
                 "
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          ></textarea>
        </div>



        {/* Personal Details */}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded text-lg"
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
      />
    </div>
  );
}

/* ------------------------------
 SIMPLE BOOKING SUMMARY MODAL
--------------------------------*/
function SimpleSummaryModal({ open, onClose, form, product, days, user, addBooking }) {
  if (!open) return null;
  const navigate = useNavigate();

  const rentalCost = product.pricing.dailyRate * days * form.quantity;
  const operatorCost = form.operators ? 800 * days : 0;
  const deliveryCost = form.deliveryAndPickup ? 500 : 0;
  const total = rentalCost + operatorCost + deliveryCost;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white p-8 w-[600px] rounded-xl shadow-2xl">

        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
          Booking Summary
        </h2>

        <p className="flex justify-between text-lg"><b>Equipment:</b><span>{product.equipmentName}</span></p>
        <p className="flex justify-between text-lg"><b>Category:</b> <span>{product.category}</span></p>
        <p className="flex justify-between text-lg"><b>Start:</b> <span>{form.startDate}</span></p>
        <p className="flex justify-between text-lg"><b>End:</b> <span>{form.endDate}</span></p>
        <p className="flex justify-between text-lg"><b>Days:</b> <span>{days}</span></p>
        <p className="flex justify-between text-lg"><b>Quantity:</b> <span>{form.quantity}</span></p>

        <hr className="my-4" />


        <p className="flex justify-between text-lg"><b>Operator:</b> <span>₹{product.operatorCharges}</span></p>
        <p className="flex justify-between text-lg"><b>Delivery:</b> <span>₹{product.deliveryPrices}</span></p>

        <hr className="my-4" />

        <p className="text-2xl font-bold text-green-700 text-right">
          Total: ₹{total}
        </p>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg text-lg">
            Cancel
          </button>


          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg text-lg"
            onClick={async () => {
              const bookingPayload = {
                product: product._id,
                farmer: user?._id,
                supplier: product.supplier,
                startDate: form.startDate,
                endDate: form.endDate,
                pickUpLocation: form.pickUpLocation,
                returnLocation: form.returnLocation,
                purpose: form.purpose,
                operators: form.operators,
                deliveryAndPickup: form.deliveryAndPickup,
                totalPrice: total,
              };

              const result = await addBooking(product._id, bookingPayload);

              if (result) {
                onClose();
                navigate("/farmer-dashboard");
                alert("Booking Successful!");
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
