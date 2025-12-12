import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/product.store.js";

function Equipmentsforms() {
  const { id } = useParams(); // if present → edit mode
  const navigate = useNavigate();

  const {
    PostProducts,
    updateProduct,
    getProductDetails,
    productDetails,
    detailsLoading,
  } = useProductStore();

  // -------------------- STATE --------------------
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    year: "",
    operator: false,
    deliveryAndPickup: false,
    deliveryPrices: 0,
    operatorCharges: 0,
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
    status: "Approved",
    agreed: false,
    images: [],
  });

  const [imagesPreview, setImagesPreview] = useState([]);

  // -------------------- LOAD DATA IN EDIT MODE --------------------
  useEffect(() => {
    if (id) {
      getProductDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && productDetails) {
      const p = productDetails;

      setFormData({
        name: p.equipmentName || "",
        category: p.category || "",
        brand: p.brand || "",
        model: p.model || "",
        year: p.yearOfManufacture || "",

        deliveryAndPickup: p.deliveryAndPickup || false,
        deliveryPrices: p.deliveryPrices || 0,   // ⭐ ADD THIS
        operator: p.operator || false,
        operatorCharges: p.operatorCharges || 0, // ⭐ ADD THIS

        condition: p.condition?.toLowerCase() || "",
        description: p.description || "",
        horsepower: p.horsepower || "",
        hours: p.operatingHours || "",
        features: [
          p.features?.gpsEnabled && "GPS",
          p.features?.automatic && "Automatic",
          p.features?.fourWD && "4WD",
          p.features?.powerSteering && "Power Steering",
        ].filter(Boolean),
        notes: p.additionalNotes || "",
        dailyRate: p.pricing?.dailyRate || "",
        weeklyRate: p.pricing?.weeklyRate || "",
        monthlyRate: p.pricing?.monthlyRate || "",
        deposit: p.pricing?.securityDeposit || "",
        available: p.availability?.available || false,
        city: p.location?.city || "",
        state: p.location?.state || "",
        pincode: p.location?.pincode || "",
        status: p.status || "Approved",
        radius: p.location?.deliveryRadius || "",
        agreed: p.agreement?.agreedToTerms || false,
        images: p.images || [],
      });

      // show existing images as preview
      setImagesPreview(p.images || []);
    }
  }, [id, productDetails]);

  // -------------------- HANDLE TEXT & CHECKBOX CHANGE --------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "features") {
      setFormData((prev) => ({
        ...prev,
        features: checked
          ? [...prev.features, value]
          : prev.features.filter((item) => item !== value),
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------- IMAGE UPLOAD --------------------
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed!");
      return;
    }

    setImagesPreview([]);
    setFormData((prev) => ({ ...prev, images: [] }));

    files.forEach((file) => {
      const previewURL = URL.createObjectURL(file);
      setImagesPreview((prev) => [...prev, previewURL]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // -------------------- SUBMIT HANDLER (ADD + EDIT) --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      // EDIT MODE
      const ok = await updateProduct(id, formData);
      if (ok) navigate("/supplier-dashboard");
    } else {
      // ADD MODE
      const ok = await PostProducts(formData);
      if (ok) navigate("/supplier-dashboard");
    }
  };

  // -------------------- FORM UI START --------------------
  return (
    <>
      <div className="w-full mx-auto bg-yellow-50">
        {/* HEADER */}
        <div className="bg-gradient-to-b from-green-700 to-green-600 text-white p-10 shadow">
          <h1 className="text-4xl font-bold text-center">
            {id ? "Edit Equipment" : "List Your Equipment"}
          </h1>
          <p className="text-center text-lg mt-2">
            {id
              ? "Update your equipment details"
              : "Fill in the details to list your farm equipment on AgroRent"}
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white w-[80%] mx-auto rounded-xl mt-10 shadow p-10 space-y-14">
          {detailsLoading && id ? (
            <p className="text-center text-gray-500">Loading equipment details...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 1. BASIC INFORMATION */}
              <section className="text-black">
                <h2 className="text-2xl font-semibold text-green-700">
                  1. Basic Information
                </h2>
                <hr className="border-yellow-500 my-2" />

                <div className="grid grid-cols-2 gap-8 mt-6">
                  <div>
                    <label className="text-green-600 font-semibold">
                      Equipment Name *
                    </label>
                    <input
                      className="w-full bg-gray-50 p-3 rounded border"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="text-green-600 font-semibold">
                      Category *
                    </label>
                    <select
                      className="w-full bg-gray-100 p-3 rounded border"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      <option value="Tractors">Tractors</option>
                      <option value="Harvesters">Harvesters</option>
                      <option value="Plows">Plows</option>
                      <option value="Seeders">Seeders</option>
                      <option value="Irrigation">Irrigation</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium">Brand *</label>
                    <input
                      className="w-full bg-gray-100 p-3 rounded border"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="font-medium">Model *</label>
                    <input
                      className="w-full bg-gray-100 p-3 rounded border"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="font-medium">
                      Year of Manufacturing *
                    </label>
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
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </section>

              {/* 2. IMAGES */}
              <section>
                <h2 className="text-2xl font-semibold text-green-700">
                  2. Equipment Images
                </h2>
                <hr className="border-yellow-500 my-2" />

                <div className="mt-4 border-2 border-dashed border-yellow-500 p-8 text-center rounded-xl">
                  <p className="text-gray-600">Upload 3–5 clear images</p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-4"
                  />

                  {imagesPreview.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {imagesPreview.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* 3. SPECIFICATIONS */}
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
                      {["GPS", "Automatic", "4WD", "Power Steering"].map(
                        (ft) => (
                          <label key={ft}>
                            <input
                              type="checkbox"
                              name="features"
                              value={ft}
                              checked={formData.features.includes(ft)}
                              onChange={handleChange}
                            />{" "}
                            {ft}
                          </label>
                        )
                      )}
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

              {/* 4. PRICING */}
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
              {/* ==============================
    4.5 STATUS
============================== */}
              <section className="text-black">
                <h2 className="text-2xl font-semibold text-green-700">
                  4.5 Equipment Status
                </h2>
                <hr className="border-yellow-500 my-2" />

                <div className="mt-6">
                  <label className="font-medium">Select Status *</label>

                  <select
                    className="w-full bg-gray-100 p-3 rounded border mt-2"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </section>


              {/* 5. LOCATION */}
              <section className="text-black">
                <h2 className="text-2xl font-semibold text-green-700">
                  4.4 Delivery & Operator Options
                </h2>
                <hr className="border-yellow-500 my-2" />

                {/* DELIVERY OPTION */}
                <label className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    name="deliveryAndPickup"
                    checked={formData.deliveryAndPickup}
                    onChange={handleChange}
                  />
                  Delivery & Pickup Available
                </label>

                {/* SHOW DELIVERY PRICE INPUT WHEN CHECKED */}
                {formData.deliveryAndPickup && (
                  <div className="mt-3 ml-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery & Pickup Charge (₹)
                    </label>
                    <input
                      type="number"
                      name="deliveryPrices"
                      placeholder="Enter delivery price"
                      value={formData.deliveryPrices}
                      onChange={handleChange}
                      className="w-64 p-2 border border-black rounded mt-1"
                    />
                  </div>
                )}


                {/* OPERATOR OPTION */}
                <label className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    name="operator"
                    checked={formData.operator}
                    onChange={handleChange}
                  />
                  Operator Available
                </label>

                {/* SHOW OPERATOR PRICE INPUT WHEN CHECKED */}
                {formData.operator && (
                  <div className="mt-3 ml-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Operator Charge (₹ per day)
                    </label>
                    <input
                      type="number"
                      name="operatorCharges"
                      placeholder="Enter operator cost per day"
                      value={formData.operatorCharges}
                      onChange={handleChange}
                      className="w-64 p-2 border border-black rounded mt-1"
                    />
                  </div>
                )}

              </section>


              {/* 5. LOCATION */}
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

              {/* 6. TERMS */}
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
                  {id ? "Save Changes" : "Submit Equipment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Equipmentsforms;
