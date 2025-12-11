import React, { useState } from "react";
import { Star, Clock, Check } from "lucide-react";


export default function BookingPage() {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quantity: 1,
    operator: false,
    delivery: false,
    insurance: false,
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Form Data:", form);
    alert("Frontend booking submitted!");
  };

  return (
    <div className="w-full bg-[#F3F6F4] min-h-screen pb-10 text-black">
      {/* PAGE TITLE */}
      <div className="px-10 pt-10 pb-4 bg-gradient-to-black from-white to-[#F3F6F4]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Complete Your Booking</h1>
            <p className="text-gray-500">Review details and confirm your rental.</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            <Step number="1" label="Details" done />
            <Line />
            <Step number="2" label="Booking" active />
            <Line />
            <Step number="3" label="Confirm" />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_33%] gap-6 px-10 mt-4">
        {/* LEFT COLUMN */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Equipment Summary */}
          <Card title="Equipment Summary">
            <div className="flex gap-6">
              <img
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=600"
                className="w-52 h-40 rounded object-cover"
              />
              <div>
                <p className="text-xs text-green-700 uppercase mb-1 tracking-wide">Tractor</p>

                <h3 className="text-xl font-bold">John Deere 5075E Tractor</h3>

                <div className="text-gray-500 mt-2">
                  <p>Rajesh Agro Services</p>

                  <div className="flex items-center gap-1 text-yellow-400 mt-1">
                    <Star size={16} fill="currentColor" /> 4.8 <span className="text-gray-500 text-sm">(24 reviews)</span>
                  </div>
                </div>

                <p className="text-green-700 font-bold text-lg mt-2">
                  ₹2,500 <span className="text-sm text-gray-600">/ day</span>
                </p>

                <button type="button" className="text-green-700 font-medium mt-2">
                  Change Equipment →
                </button>
              </div>
            </div>
          </Card>

          {/* Rental Details */}
          <Card title="Rental Details">
            <div className="grid grid-cols-2 gap-4 text-black">
              <FormField label="Rental Start Date *">
                <input
                  type="date"
                  className="input-field"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </FormField>

              <FormField label="Rental End Date *">
                <input
                  type="date"
                  className="input-field"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-black">
              <FormField label="Quantity *">
                <input
                  type="number"
                  min={1}
                  className="input-field border-black"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">How many units do you need?</p>
              </FormField>

              <div className="bg-gray-100 p-3 rounded flex items-center gap-2 text-sm text-gray-700 mt-auto">
                <Clock size={16} className="text-green-700" />
                Duration: <strong>5 days</strong>
              </div>
            </div>
          </Card>

          {/* Add-ons */}
          <Card title="Add-ons & Extras">
            <Addon
              label="Professional Operator"
              price="₹800/day"
              checked={form.operator}
              onClick={() => handleChange("operator", !form.operator)}
            />

            <Addon
              label="Delivery & Pickup"
              price="₹500"
              checked={form.delivery}
              onClick={() => handleChange("delivery", !form.delivery)}
            />

           
          </Card>

          {/* Farmer Details */}
          <Card title="Farmer / Renter Details">
            <div className="grid grid-cols-2 gap-4 text-black">
              <FormField label="Full Name *">
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input-field"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </FormField>

              <FormField label="Phone Number *">
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Email Address *">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="input-field"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormField>

            <FormField label="Delivery Address *">
              <input
                type="text"
                placeholder="Enter address"
                className="input-field"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="City / Village *">
                <input
                  type="text"
                  className="input-field"
                  placeholder="City name"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </FormField>

              <FormField label="Pincode *">
                <input
                  type="text"
                  className="input-field"
                  placeholder="XXXXXX"
                  value={form.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </FormField>
            </div>
          </Card>

          {/* Payment */}
          <Card title="Payment Method">
            <PaymentOption label="Cash On Delivery" selected />
          
          </Card>

          {/* Terms */}
          <Card title="Terms & Policies">
            <Checkbox label="I agree to the Rental Terms and Conditions *" />
            <Checkbox label="I accept the Cancellation Policy *" />
            <Checkbox label="I agree to the Damage & Liability Policy *" />
          </Card>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg text-lg"
          >
            Confirm Booking
          </button>
        </form>

        {/* RIGHT SUMMARY COLUMN */}
        <div className="sticky top-24">
          <Card title="Booking Summary">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=100"
                className="w-14 h-14 rounded object-cover"
              />
              <div>
                <p className="font-bold text-sm">John Deere 5075E</p>
                <p className="text-xs text-gray-500">Tractor</p>
              </div>
            </div>

            <Divider />

            <Summary label="Start Date" value={form.startDate || "-"} />
            <Summary label="End Date" value={form.endDate || "-"} />
            <Summary label="Quantity" value={form.quantity} />

            <Divider />

            <Summary label="Rental Cost" value="₹12,500" />
            <p className="text-xs text-gray-500">(₹2,500 × 5 days × 1)</p>

            <Divider />

            <Summary label="Operator" value={form.operator ? "₹4,000" : "—"} />
            <Summary label="Delivery" value={form.delivery ? "₹500" : "—"} />
            <Summary label="Insurance" value={form.insurance ? "₹1,000" : "—"} />

            <Divider />

            <Summary label="Subtotal" value="₹18,000" />
            <Summary label="Taxes (10%)" value="₹1,800" />
            <Summary label="Security Deposit" value="₹10,000" />

            <Divider />

            <div className="flex justify-between items-end mt-3">
              <span className="font-bold text-lg">Total</span>
              <span className="text-2xl font-bold text-green-900">₹29,800</span>
            </div>

            <div className="bg-yellow-100 text-yellow-800 text-xs text-center py-2 rounded mt-3">
              ₹10,000 Security Deposit is Refundable
            </div>

            <button className="w-full mt-5 bg-green-700 text-white py-3 rounded-lg font-semibold">
              Proceed to Payment
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------- SMALL COMPONENTS ----------------------------- */

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-green-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

function Addon({ label, price, checked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg flex gap-4 cursor-pointer transition mb-3 ${
        checked ? "border-green-700 bg-green-50" : "border-gray-300"
      }`}
    >
      <div className="w-5 h-5 border-2 border-gray-500 rounded-sm flex items-center justify-center">
        {checked && <RiCheckLine className="text-green-700" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between font-medium">
          <span>{label}</span>
          <span className="text-green-700">{price}</span>
        </div>
        <p className="text-xs text-gray-500">Optional add-on</p>
      </div>
    </div>
  );
}

function PaymentOption({ label, selected }) {
  return (
    <div
      className={`flex items-center p-4 border rounded-lg mb-3 cursor-pointer ${
        selected ? "border-green-700 bg-green-50" : "border-gray-300"
      }`}
    >
      <div className="w-[20px] h-[20px] border-2 rounded-full mr-3">
        {selected && <div className="w-3 h-3 bg-green-700 rounded-full mt-[3px] mx-auto" />}
      </div>
      <span>{label}</span>
    </div>
  );
}

function Checkbox({ label }) {
  return (
    <div className="flex items-start gap-2 mb-2">
      <input type="checkbox" className="w-4 h-4 mt-1" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="flex justify-between mb-2 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-b border-gray-200 my-4"></div>;
}

function Step({ number, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium 
        ${
          done
            ? "bg-green-700 text-white border-green-700"
            : active
            ? "border-green-700 text-green-700"
            : "border-gray-300 text-gray-400"
        }`}
      >
        {done ? <Check size={16} /> : number}
      </div>
      <span className={`text-sm ${active ? "text-green-700" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

function Line() {
  return <div className="w-12 h-[2px] bg-gray-300"></div>;
}
