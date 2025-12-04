import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/product.store";
import FarmerNavabar from "../dashboard/navBar2";
import{Edit ,Trash2,Eye} from 'lucide-react';

function SupplierEquipment() {

  const navigate = useNavigate();
  const { supplierProducts, getSupplierProducts, deleteProduct } = useProductStore();

  // Filters
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Equipment");
  const [status, setStatus] = useState("All");

  // Load products on mount
  useEffect(() => {
    getSupplierProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    if (!supplierProducts) return [];

    return supplierProducts.filter((eq) => {
      // Search filter
      if (
        search &&
        !eq.equipmentName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (activeCategory !== "All Equipment" && eq.category !== activeCategory) {
        return false;
      }

      // Status filter
      if (status !== "All" && eq.status !== status) {
        return false;
      }

      return true;
    });
  }, [supplierProducts, search, activeCategory, status]);

  return (
    <>
    <FarmerNavabar />
    <div className="w-full mx-auto p-6  min-h-screen bg-yellow-50">
        
    <div className="bg-white p-6 rounded-xl shadow-md w-full">

      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-700">My Equipment</h2>

        <button
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          onClick={() => navigate("/equipments-form")}
        >
          + Add New Equipment
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-4 mb-5">
        <input
          type="text"
          placeholder="Search equipment..."
          className="flex-1 border px-4 py-2 rounded-lg bg-gray-200 border-black text-black font-semibold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="border px-4 py-2 rounded-lg text-green-700 font-semibold bg-gray-50"
        >
          <option value="All Equipment">All Categories</option>
          <option value="Tractors">Tractors</option>
          <option value="Harvesters">Harvesters</option>
          <option value="Plows">Plows</option>
          <option value="Seeders">Seeders</option>
          <option value="Irrigation">Irrigation</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-2 rounded-lg text-green-700 font-semibold bg-gray-50"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 text-sm">
            <th className="p-4">Equipment</th>
            <th className="p-4">Status</th>
            <th className="p-4">Rental Rate</th>
            <th className="p-4">Days Rented</th>
            <th className="p-4">Revenue</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((eq) => (
            <tr
              key={eq._id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-4 flex items-center gap-4">
                <img
                  src={eq.images?.[0] || "/placeholder.jpg"}
                  className="w-14 h-14 object-contain rounded border bg-white"
                />
                <div>
                  <p className="font-semibold text-gray-800">{eq.equipmentName}</p>
                  <p className="text-sm text-gray-500">{eq.category}</p>
                </div>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    eq.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : eq.status === "Rented"
                      ? "bg-orange-100 text-orange-700"
                      : eq.status === "Maintenance"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {eq.status}
                </span>
              </td>

              <td className="p-4 font-semibold text-gray-800">
                ₹{eq.pricing?.dailyRate}/day
              </td>

              <td className="p-4 text-gray-600">
                <span className="font-semibold">{eq.daysRented || 0} days</span>
              </td>

              <td className="p-4 text-gray-600">
                <span className="font-semibold">₹{eq.revenue || 0}</span>
              </td>

              <td className="p-4 flex gap-3">
                <button
                  onClick={() => navigate(`/equipments-form/${eq._id}`)}
                  className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  <Edit />
                </button>

                <button
                  onClick={() => deleteProduct(eq._id)}
                  className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <Trash2 />
                </button>

                <button
                  onClick={() => navigate(`/equipment/${eq._id}`)}
                  className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <Eye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    </div>
    </>
  );
}

export default SupplierEquipment;
