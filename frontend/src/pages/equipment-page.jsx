import React, { useEffect, useState } from "react";
import { MapPin, Star, CheckCircle, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../store/product.store";
import { useAuthStore } from "../store/authstore.js";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore.js"
import { useBookingStore } from "../store/booking.store.js";

export default function EquipmentDetails() {
  const { addBooking } = useBookingStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { getProductDetails, productDetails, detailsLoading, updateProduct } = useProductStore();

  const [activeImage, setActiveImage] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    getProductDetails(id);

  }, [id]);

  if (detailsLoading) return <div className="p-6 text-center">Loading...</div>;
  if (!productDetails) return <div className="p-6 text-center text-red-600">Equipment not found</div>;

  const equipment = productDetails;

  const images = equipment.images?.length
    ? equipment.images
    : ["/placeholder1.jpg", "/placeholder2.jpg"];

  return (
    <div className="w-full bg-yellow-50 mx-auto p-6">

      {/* ---------------- IMAGE SLIDER ---------------- */}
      <div className="relative w-full h-[380px] bg-gray-200 rounded-xl overflow-hidden">
        <img src={images[activeImage]} className="w-full h-full object-contain" />

        {/* Slider arrows */}
        <button
          onClick={() => setActiveImage(activeImage > 0 ? activeImage - 1 : images.length - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow"
        >
          ‹
        </button>
        <button
          onClick={() => setActiveImage((activeImage + 1) % images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow"
        >
          ›
        </button>

        {/* thumbnails */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-12 rounded-md object-cover border cursor-pointer ${i === activeImage ? "border-green-600" : "border-transparent"
                }`}
            />
          ))}
        </div>
      </div>

      {/* ---------------- TITLE ---------------- */}
      <div className="mt-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl  text-green-700 font-semibold">{equipment.equipmentName}</h1>

          <div className="flex gap-3 mt-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{equipment.category}</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              {equipment.condition} Condition
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-gray-700">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star fill="currentColor" size={16} /> 4.8 (24 reviews)
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} />
              {equipment.location?.city || "Unknown"}, {equipment.location?.state || ""}
            </div>
          </div>
        </div>

        <div className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-500">#{equipment._id?.slice(-6)}</div>
      </div>

      {/* ---------------- DESCRIPTION ---------------- */}
      <div className="mt-8">
        <h2 className="text-xl  text-green-700 font-semibold mb-2">Description</h2>
        <p className="text-gray-600 leading-7">
          {showMore ? equipment.description : equipment.description?.slice(0, 250) + "..."}
        </p>
        {equipment.description?.length > 200 && (
          <button onClick={() => setShowMore(!showMore)} className="text-green-700 font-medium mt-1">
            {showMore ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* ---------------- SPECIFICATIONS ---------------- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold  text-green-700 mb-3">Specifications</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {equipment.horsepower && (
            <SpecBox label="Engine Power" value={`${equipment.horsepower} HP`} />
          )}

          <SpecBox label="Fuel Type" value={equipment.fuelType || "Diesel"} />

          <SpecBox
            label="Model Year"
            value={equipment.yearOfManufacture || "N/A"}
          />

          <SpecBox
            label="Transmission"
            value={equipment.features?.automatic ? "Automatic" : "Manual"}
          />

          <SpecBox label="Operating Hours" value={equipment.operatingHours || "N/A"} />

          {equipment.pricing?.securityDeposit && (
            <SpecBox label="Security Deposit" value={`₹${equipment.pricing.securityDeposit}`} />
          )}
        </div>
      </div>

      {/* ---------------- FEATURES ---------------- */}
      <div className="mt-10">
        <h2 className="text-xl text-green-700 font-semibold mb-3">Features</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700">
          {Object.entries(equipment.features || {}).map(([key, val]) =>
            val ? (
              <div key={key} className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={18} /> {key}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* ---------------- PRICING ---------------- */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Pricing</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SpecBox label="Daily Rate" value={`₹${equipment.pricing?.dailyRate}`} />
          <SpecBox label="Weekly Rate" value={`₹${equipment.pricing?.weeklyRate || "N/A"}`} />
          <SpecBox label="Monthly Rate" value={`₹${equipment.pricing?.monthlyRate || "N/A"}`} />
        </div>
      </div>

      {/* ---------------- AVAILABILITY ---------------- */}
      <div className="mt-10">
        <h2 className="text-xl  text-green-700 font-semibold mb-3">Availability</h2>

        <div className="flex items-center gap-3 text-gray-700">
          <Clock size={18} />
          <span>
            {equipment.availability?.available ? (
              <span className="text-green-600 font-semibold">Available Now</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Available</span>
            )}
          </span>
        </div>
      </div>

      {/* ---------------- LOCATION ---------------- */}
      <div className="mt-10">
        <h2 className="text-xl text-green-700  font-semibold mb-3">Location</h2>

        <div className="text-gray-700 leading-7">
          <p>Address: {equipment.location?.address || "Not Provided"}</p>
          <p>
            {equipment.location?.city}, {equipment.location?.state} -
            {equipment.location?.pincode}
          </p>
          <p>Delivery Radius: {equipment.location?.deliveryRadius || 0} km</p>
        </div>
      </div>

      {/* ---------------- TERMS ---------------- */}
      <div className="mt-10">
        <h2 className="text-xl text-green-700 font-semibold mb-3">Terms & Conditions</h2>

        <ul className="list-disc ml-5 text-gray-700 leading-7">
          <li>{equipment.terms?.rentalTerms || "Standard rental terms apply."}</li>
          <li>{equipment.terms?.cancellationPolicy || "No cancellation policy added."}</li>
          <li>{equipment.terms?.damagePolicy || "Standard damage policy applies."}</li>
        </ul>
      </div>

      {/* ---------------- BUTTONS ---------------- */}
      {
        user && user.role === 'farmer' && (<div className="flex justify-end gap-4 mt-12">
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600"
            onClick={() => {
              addToCart({
                equipmentId: equipment._id,
                quantity: 1,
              });
              navigate('/cart');
            }}
          >
            Add to Cart
          </button>

          <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700"
            onClick={() => {
              addBooking(equipment._id);
              navigate(`/booking-form/${equipment._id}`);
            }}
          >
            Book Now
          </button>
        </div>)
      }

    </div>
  );
}

/* ---------------- SMALL SPEC BOX COMPONENT ---------------- */
function SpecBox({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-semibold mt-1">{value}</p>
    </div>
  );
}
