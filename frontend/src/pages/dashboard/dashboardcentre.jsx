import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '../../store/product.store.js'
import { Filter, Search, X, Edit, Trash } from "lucide-react";
import { useBookingStore } from '../../store/booking.store.js';
// import { useProductStore } from '../../store/product.store.js';

const categories = [
  "All Equipment",
  "Tractors",
  "Harvesters",
  "Plows",
  "Seeders",
  "Irrigation",
];


function DashboardCentre() {
  const { updateProduct, deleteProduct } = useProductStore();
  const { getRequest } = useBookingStore();
  const [requests, setRequests] = useState([]);
  

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getRequest();
        setRequests(data || []);
      } catch (err) {
        console.error(err);
      } finally {
       
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

  const latestRequests = [...requests]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 3);



  const navigate = useNavigate();
  const { supplierProducts, getSupplierProducts, loading } = useProductStore();
  const [activeCategory, setActiveCategory] = useState("All Equipment");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    getSupplierProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event.target.closest('.filter-container')) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    if (!supplierProducts || supplierProducts.length === 0) return [];

    return supplierProducts.filter((item) => {
      // Category filter
      if (activeCategory !== "All Equipment") {
        if (item.category?.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.equipmentName?.toLowerCase().includes(searchLower) ||
          item.brand?.toLowerCase().includes(searchLower) ||
          item.model?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Price filter
      const dailyRate = item.pricing?.dailyRate || 0;
      if (minPrice && dailyRate < Number(minPrice)) return false;
      if (maxPrice && dailyRate > Number(maxPrice)) return false;

      // Condition filter
      if (condition !== "All" && item.condition !== condition) return false;

      // Availability filter
      if (availability !== "All") {
        if (availability === "Available" && !item.availability?.available) return false;
        if (availability === "Unavailable" && item.availability?.available) return false;
      }

      // Status filter
      if (status !== "All" && item.status !== status) return false;

      return true;
    });
  }, [supplierProducts, activeCategory, search, minPrice, maxPrice, condition, availability, status]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCondition("All");
    setAvailability("All");
    setStatus("All");
  };

  const hasActiveFilters = minPrice || maxPrice || condition !== "All" || availability !== "All" || status !== "All";
  return (
    <>
      <div className=" w-full p-6 space-y-8">

        {/* TOP STATS */}
        <div className="grid grid-cols-4 gap-5 w-full">

          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <div className="bg-green-100 text-green-700 p-3 rounded-lg">
              <i className="fas fa-tractor"></i>
            </div>
            <div>
              <p className="text-xl font-semibold">{supplierProducts?.length || 0}</p>
              <p className="text-gray-500 text-sm">Total Equipment</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <div className="bg-orange-100 text-orange-700 p-3 rounded-lg">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div>
              <p className="text-xl font-semibold">8</p>
              <p className="text-gray-500 text-sm">Active Rentals</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg">
              <i className="fas fa-wallet"></i>
            </div>
            <div>
              <p className="text-xl font-semibold">$4,280</p>
              <p className="text-gray-500 text-sm">Monthly Earnings</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <div className="bg-pink-100 text-pink-700 p-3 rounded-lg">
              <i className="fas fa-star"></i>
            </div>
            <div>
              <p className="text-xl font-semibold">4.8</p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
          </div>
        </div>


        {/* MY EQUIPMENT SECTION */}
        <div className="bg-white rounded-xl shadow p-5 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Equipment</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" onClick={() => navigate("/equipments-form")}>+ Add Equipment</button>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 items-center relative filter-container mb-4">
            <div className="flex items-center bg-gray-50 w-full p-3 rounded-xl border hover:border-green-400 transition">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search your equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-2 w-full outline-none bg-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${hasActiveFilters
                ? "bg-green-800 text-white"
                : "bg-green-700 text-white hover:bg-green-800"
                }`}
            >
              <Filter size={18} />
              Filters
              {hasActiveFilters && (
                <span className="bg-white text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  !
                </span>
              )}
            </button>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border p-5 z-10 w-80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Advanced Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (₹/day)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:border-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-green-500"
                  >
                    <option value="All">All Conditions</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-green-500"
                  >
                    <option value="All">All</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:border-green-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-3 mb-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border transition ${activeCategory === cat
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {supplierProducts?.length || 0} equipment
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading equipment...</p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.slice(0, 3).map((equipment) => (
                <div key={equipment._id} className="bg-gray-50 p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition"
                  onClick={() => navigate(`/equipment/${equipment._id}`)}
                >
                  {/* Equipment Image */}
                  <div className="relative h-40 bg-gray-200 rounded-lg mb-3 overflow-hidden group">

                    {/* EDIT BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/equipments-form/${equipment._id}`);
                      }}
                      className="absolute top-2 left-2 bg-white/90 p-2 rounded-full shadow-md z-20 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Edit size={18} className="text-green-700" />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(equipment._id);
                      }}
                      className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md z-20 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash size={18} className="text-red-600" />
                    </button>

                    {/* IMAGE */}
                    {equipment.images && equipment.images.length > 0 ? (
                      <img
                        src={equipment.images[0]}
                        alt={equipment.equipmentName}
                        className="w-full h-full object-cover z-10"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 z-10">
                        <i className="fas fa-tractor text-4xl"></i>
                      </div>
                    )}

                  </div>


                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{equipment.equipmentName}</h3>
                      <p className="text-sm text-gray-500">{equipment.category}</p>
                      {equipment.brand && (
                        <p className="text-xs text-gray-400 mt-1">
                          {equipment.brand} {equipment.model ? `- ${equipment.model}` : ''}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${equipment.status === 'Approved'
                      ? 'text-green-700 bg-green-100'
                      : equipment.status === 'Pending'
                        ? 'text-yellow-700 bg-yellow-100'
                        : 'text-red-700 bg-red-100'
                      }`}>
                      {equipment.status || 'Pending'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      {equipment.horsepower && (
                        <>
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          {equipment.horsepower} HP
                        </>
                      )}
                    </div>
                    <span className="text-green-600 font-semibold">
                      ₹{equipment.pricing?.dailyRate || 0}/day
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${equipment.availability?.available
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                      }`}>
                      {equipment.availability?.available ? 'Available' : 'Unavailable'}
                    </span>
                    {equipment.condition && (
                      <span className="text-xs text-gray-500">
                        Condition: <span className="font-medium">{equipment.condition}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {supplierProducts && supplierProducts.length > 0
                  ? "No equipment matches your filters"
                  : "No equipment listed yet"}
              </p>
              {supplierProducts && supplierProducts.length > 0 && hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="text-green-700 hover:underline text-sm"
                >
                  Clear all filters
                </button>
              ) : (
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  onClick={() => navigate("/equipments-form")}
                >
                  Add Your First Equipment
                </button>
              )}
            </div>
          )}
          <button onClick={() => navigate("/supplier-equipments")} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 mt-5 ">See More</button>
        </div>


        {/* RENTAL REQUESTS SECTION */}
        {/* RENTAL REQUESTS SECTION */}
        <div className="bg-white rounded-xl shadow p-5 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Rental Requests</h2>
            <button
              onClick={() => navigate("/supplier-rentals")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              View All
            </button>
          </div>

          {/* Tabs (UI only for now) */}
         

          {/* Requests List */}
          {latestRequests && latestRequests.length > 0 ? (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {latestRequests.map((r) => (
                <div
                  key={r._id}
                  className="bg-gray-50 rounded-xl p-4 grid grid-cols-[1fr_220px_140px_180px] items-center gap-4 shadow-sm"
                >
                  {/* Farmer + Product */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {r.product?.equipmentName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {r.farmer?.name} • {r.product?.category}
                    </p>
                  </div>

                  {/* Period */}
                  <div className="text-sm text-gray-600 text-center">
                    <p>
                      {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    </p>
                    <p className="text-xs">
                      {calculateDays(r.startDate, r.endDate)} days
                    </p>
                  </div>

                  {/* Price */}
                  <div className="font-semibold text-green-700 text-center">
                    ₹{r.totalPrice}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    {r.status === "Pending" ? (
                      <>
                        <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">
                          Decline
                        </button>
                      </>
                    ) : (
                      <button className="px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100">
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No rental requests available
            </div>
          )}
        </div>


      </div>

    </>
  )
}

export default DashboardCentre
