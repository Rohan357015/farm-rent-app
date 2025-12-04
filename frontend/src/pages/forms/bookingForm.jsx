import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function BookingModal({ equipment, onClose, onSubmit }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    location: "",
    pickupLocation: "",
    returnLocation: "",
    operator: false,
    delivery: false,
    insurance: false,
    fuelService: false,
    purpose: "",
    paymentMethod: "visa",
    agreed: false,
  });

  const [days, setDays] = useState(0);

  const addOns = {
    operator: 150,
    delivery: 100,
    insurance: 75,
    fuelService: 85,
  };

  // CALCULATE DAYS
  useEffect(() => {
    if (form.startDate && form.endDate) {
      const s = new Date(form.startDate);
      const e = new Date(form.endDate);
      const diff = (e - s) / (1000 * 60 * 60 * 24);
      setDays(diff >= 1 ? diff : 0);
    }
  }, [form.startDate, form.endDate]);

  const total =
    equipment.pricing.dailyRate * days +
    (form.operator ? addOns.operator * days : 0) +
    (form.delivery ? addOns.delivery : 0) +
    (form.insurance ? addOns.insurance * days : 0) +
    (form.fuelService ? addOns.fuelService : 0) +
    equipment.pricing.dailyRate * days * 0.08;

  // SUBMIT
  const handleSubmit = () => {
    if (!form.agreed) return alert("Please accept terms & conditions.");

    onSubmit({
      ...form,
      days,
      total,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-[700px] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-green-700">Book Equipment</h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* EQUIPMENT SUMMARY */}
        <div className="mt-4 flex gap-4">
          <img
            src={equipment.images[0]}
            className="w-24 h-24 rounded-lg object-cover border"
          />
          <div>
            <h3 className="text-lg font-semibold">{equipment.equipmentName}</h3>
            <p className="text-green-700 text-lg font-bold">
              ₹{equipment.pricing.dailyRate} / day
            </p>
            <p className="text-gray-500 text-sm">{equipment.description}</p>
          </div>
        </div>

        {/* RENTAL PERIOD */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Rental Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="p-2 border rounded-lg bg-gray-50"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <input
              type="date"
              className="p-2 border rounded-lg bg-gray-50"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Pickup Location"
              className="p-2 border rounded-lg bg-gray-50"
              value={form.pickupLocation}
              onChange={(e) =>
                setForm({ ...form, pickupLocation: e.target.value })
              }
            />
            <input
              placeholder="Return Location"
              className="p-2 border rounded-lg bg-gray-50"
              value={form.returnLocation}
              onChange={(e) =>
                setForm({ ...form, returnLocation: e.target.value })
              }
            />
          </div>
        </div>

        {/* PURPOSE */}
        <div className="mt-6">
          <label className="font-medium">Purpose of Rental</label>
          <textarea
            placeholder="Explain why you need this equipment..."
            className="w-full p-2 border rounded-lg bg-gray-50"
            rows={3}
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
        </div>

        {/* COST BREAKDOWN */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Cost Breakdown</h3>

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Base Rental ({days} days)</span>
              <span>₹{equipment.pricing.dailyRate * days}</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes (8%)</span>
              <span>₹{(equipment.pricing.dailyRate * days * 0.08).toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-green-700 mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* TERMS */}
        <label className="flex items-center gap-3 mt-4 text-sm">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          />
          I agree to the Terms and Conditions.
        </label>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
}
