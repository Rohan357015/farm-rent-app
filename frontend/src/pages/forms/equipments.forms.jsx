import React, { useState } from 'react';
import { useProductStore } from '../../store/product.store.js';

function Equipmentsforms() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    year: "",
    condition: "",
    description: "",
    horsepower: "",
    hours: "",
    features: [],
    notes: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    deposit: "",
    available: false,
    city: "",
    state: "",
    pincode: "",
    radius: "",
    agreed: false,
  });

  const { PostProducts } = useProductStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // checkboxes for features (array)
    if (name === "features") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          features: [...prev.features, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          features: prev.features.filter((item) => item !== value),
        }));
      }
      return;
    }

    // single checkbox / radio / others
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // yahan API / store call
    PostProducts(formData);
    console.log("Submitted formData:", formData);
  };

  return (
    <>
      <div className="w-full mx-auto  bg-yellow-50 ">
        {/* ===== TOP HEADER ===== */}
        <div className="bg-gradient-to-b from-green-700 to-green-600 text-white p-10  shadow">
          <h1 className="text-4xl font-bold text-center">List Your Equipment</h1>
          <p className="text-center text-lg mt-2">
            Fill in the details to list your farm equipment on AgroRent
          </p>
        </div>

        {/* ===== MAIN FORM CARD ===== */}
        <div className="bg-white   w-[80%] mx-auto  rounded-xl mt-10 shadow p-10 space-y-14">
          <form action="" onSubmit={handleSubmit}>
            {/* ================================
                1. BASIC INFORMATION
            ================================= */}
            <section className="text-black">
              <h2 className="text-2xl font-semibold text-green-700">
                1. Basic Information
              </h2>
              <hr className="border-yellow-500 my-2" />

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <label className=" text-green-600 font-semibold">
                    Equipment Name *
                  </label>
                  <input
                    className="w-full bg-gray-50 p-3 rounded border"
                    placeholder="e.g., John Deere Tractor"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className=" text-green-600 font-semibold">
                    Category *
                  </label>
                  <select
                    className="w-full bg-gray-100 p-3 rounded border"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    <option value="tractor">Tractor</option>
                    <option value="harvester">Harvester</option>
                    <option value="implement">Implement</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium">Brand *</label>
                  <input
                    className="w-full bg-gray-100 p-3 rounded border"
                    placeholder="John Deere"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="font-medium">Model *</label>
                  <input
                    className="w-full bg-gray-100 p-3 rounded border"
                    placeholder="5310"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="font-medium">Year of Manufacturing *</label>
                  <select
                    className="w-full bg-gray-100 p-3 rounded border"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const year = 2025 - idx;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="font-medium">Condition *</label>
                  <div className="flex gap-4 mt-3">
                    <label>
                      <input
                        type="radio"
                        name="condition"
                        value="excellent"
                        checked={formData.condition === "excellent"}
                        onChange={handleChange}
                      />{" "}
                      Excellent
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="condition"
                        value="good"
                        checked={formData.condition === "good"}
                        onChange={handleChange}
                      />{" "}
                      Good
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="condition"
                        value="fair"
                        checked={formData.condition === "fair"}
                        onChange={handleChange}
                      />{" "}
                      Fair
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="font-medium">Description *</label>
                <textarea
                  className="w-full bg-gray-100 p-3 rounded border"
                  rows="4"
                  placeholder="Describe your equipment in detail..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </section>

            {/* ================================
                2. EQUIPMENT IMAGES
            ================================= */}
            <section>
              <h2 className="text-2xl font-semibold text-green-700">
                2. Equipment Images
              </h2>
              <hr className="border-yellow-500 my-2" />

              <div className="mt-4 border-2 border-dashed border-yellow-500 p-8 text-center rounded-xl">
                <p className="text-gray-600">Upload 3–5 clear images</p>
                {/* Image upload handling baad me add kar sakte ho */}
              </div>
            </section>

            {/* ================================
                3. SPECIFICATIONS & FEATURES
            ================================= */}
            <section className="text-black">
              <h2 className="text-2xl font-semibold text-green-700">
                3. Specifications & Features
              </h2>
              <hr className="border-yellow-500 my-2" />

              <div className="grid grid-cols-2 gap-8 mt-6">
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Horsepower (HP)"
                  name="horsepower"
                  value={formData.horsepower}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Operating Hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <p className="font-medium mb-2">Features</p>
                  <div className="grid grid-cols-2 gap-3">
                    <label>
                      <input
                        type="checkbox"
                        name="features"
                        value="GPS"
                        checked={formData.features.includes("GPS")}
                        onChange={handleChange}
                      />{" "}
                      GPS
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="features"
                        value="Automatic"
                        checked={formData.features.includes("Automatic")}
                        onChange={handleChange}
                      />{" "}
                      Automatic
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="features"
                        value="4WD"
                        checked={formData.features.includes("4WD")}
                        onChange={handleChange}
                      />{" "}
                      4WD
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="features"
                        value="Power Steering"
                        checked={formData.features.includes("Power Steering")}
                        onChange={handleChange}
                      />{" "}
                      Power Steering
                    </label>
                  </div>
                </div>

                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Additional Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* ================================
                4. PRICING
            ================================= */}
            <section className="text-black">
              <h2 className="text-2xl font-semibold text-green-700">
                4. Pricing
              </h2>
              <hr className="border-yellow-500 my-2" />

              <div className="grid grid-cols-2 gap-8 mt-6">
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Daily Rate (₹)"
                  name="dailyRate"
                  value={formData.dailyRate}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Weekly Rate (₹)"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Monthly Rate (₹)"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Security Deposit (₹)"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* ================================
                5. LOCATION & AVAILABILITY
            ================================= */}
            <section className="text-black">
              <h2 className="text-2xl font-semibold text-green-700">
                5. Availability & Location
              </h2>
              <hr className="border-yellow-500 my-2" />

              <label className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />{" "}
                Available for Rent
              </label>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                <input
                  className="bg-gray-100 p-3 rounded border"
                  placeholder="Delivery Radius (km)"
                  name="radius"
                  value={formData.radius}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* ================================
                6. TERMS & SUBMIT
            ================================= */}
            <section className="text-black">
              <h2 className="text-2xl font-semibold text-green-700">
                6. Terms & Conditions
              </h2>
              <hr className="border-yellow-500 my-2" />

              <label className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                />{" "}
                I agree to the Terms & Conditions
              </label>
            </section>

            {/* SUBMIT BUTTON */}
            <div className="text-center pt-5">
              <button
                type="submit"
                className="bg-green-600 text-white px-10 py-3 rounded-xl text-lg font-semibold hover:bg-green-700"
              >
                Submit Equipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Equipmentsforms;
