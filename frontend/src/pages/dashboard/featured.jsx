import React, { useState, useEffect, useMemo } from "react";
import { Filter, Search, Star, X } from "lucide-react";
import { useProductStore } from "../../store/product.store";
import { useNavigate } from "react-router-dom";


const categories = [
  "All Equipment",
  "Tractors",
  "Harvesters",
  "Plows",
  "Seeders",
  "Irrigation",
];


export default function EquipmentBrowser() {
    const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Equipment");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("All");
  const [availability, setAvailability] = useState("All");
  const { products, getFarmerProducts, loading } = useProductStore();

  useEffect(() => {
    getFarmerProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug: Log products when they change
  useEffect(() => {
    console.log("🛠️ Products in component:", products);
    console.log("🛠️ Products length:", products?.length || 0);
    console.log("🛠️ Loading state:", loading);
  }, [products, loading]);

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
    if (!products || products.length === 0) return [];

    return products.filter((item) => {
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

      return true;
    });
  }, [products, activeCategory, search, minPrice, maxPrice, condition, availability]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCondition("All");
    setAvailability("All");
  };

  const hasActiveFilters = minPrice || maxPrice || condition !== "All" || availability !== "All";

  return (
    <div className="w-full bg-[#F8FAF3] p-6 rounded-xl">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Search & Browse Equipment
        </h2>

        <button className="text-green-700 font-medium hover:underline">
          View all equipment →
        </button>
      </div>

      

      {/* Categories */}
      <div className="flex gap-3 mt-5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === cat
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
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products?.length || 0} equipment
        </div>
      )}

      {/* Equipment Cards */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading equipment...</p>
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/equipment/${item._id}`)}
              className="bg-white rounded-xl shadow-2xl hover:shadow-md transition"
            >
              {/* Image */}
              <div className="h-40 w-full bg-green-100 rounded-t-xl overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0]} 
                    alt={item.equipmentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <i className="fas fa-tractor text-4xl"></i>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.equipmentName}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    {item.brand && (
                      <p className="text-xs text-gray-400 mt-1">
                        {item.brand} {item.model ? `- ${item.model}` : ""}
                      </p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {item?.location?.city || "Unknown Location"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    {item.horsepower && (
                      <>
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        {item.horsepower} HP
                      </>
                    )}
                  </div>
                  <span className="text-green-600 font-semibold">
                    ₹{item.pricing?.dailyRate || 0}/day
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                    {item.averageRating || 0} equipment rating
                  </span>
                  <span>Supplier {item.supplier?.averageRating || 0}</span>
                </div>

                {item.condition && (
                  <div className="mt-2 text-xs text-gray-500">
                    Condition: <span className="font-medium">{item.condition}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {products && products.length > 0 
              ? "No equipment matches your filters" 
              : "No equipment available"}
          </p>
          {products && products.length > 0 && hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-green-700 hover:underline text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
