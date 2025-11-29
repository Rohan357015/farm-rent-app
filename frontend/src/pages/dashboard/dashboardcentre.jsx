import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '../../store/product.store.js'

function DashboardCentre() {
    const navigate = useNavigate();
    const { supplierProducts, getSupplierProducts, loading } = useProductStore();

    useEffect(() => {
        getSupplierProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" onClick={()=>navigate("/equipments-form")}>+ Add Equipment</button>
    </div>

    {loading ? (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading equipment...</p>
      </div>
    ) : supplierProducts && supplierProducts.length > 0 ? (
      <div className="grid grid-cols-3 gap-5">
        {supplierProducts.map((equipment) => (
          <div key={equipment._id} className="bg-gray-50 p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition">
            {/* Equipment Image */}
            <div className="h-28 bg-gray-200 rounded-lg mb-3 overflow-hidden">
              {equipment.images && equipment.images.length > 0 ? (
                <img 
                  src={equipment.images[0]} 
                  alt={equipment.equipmentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-tractor text-4xl"></i>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-gray-800">{equipment.equipmentName}</h3>
            <p className="text-gray-500 text-sm">
              {equipment.brand} {equipment.model ? `- ${equipment.model}` : ''}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-green-600 font-semibold">
                ₹{equipment.pricing?.dailyRate || 0}/day
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                equipment.availability?.available 
                  ? 'text-green-700 bg-green-100' 
                  : equipment.status === 'Pending'
                  ? 'text-yellow-700 bg-yellow-100'
                  : 'text-red-700 bg-red-100'
              }`}>
                {equipment.availability?.available ? 'Available' : equipment.status || 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No equipment listed yet</p>
        <button 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate("/equipments-form")}
        >
          Add Your First Equipment
        </button>
      </div>
    )}

    {supplierProducts && supplierProducts.length > 0 && (
      <div className="text-center mt-4">
        <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
          View All Equipment
        </button>
      </div>
    )}
  </div>


  {/* RENTAL REQUESTS SECTION */}
  <div className="bg-white rounded-xl shadow p-5 w-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Rental Requests</h2>
      <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
        View All
      </button>
    </div>

    {/* Tabs */}
    <div className="flex space-x-6 border-b pb-2 mb-4">
      <button className="text-green-600 font-semibold border-b-2 border-green-600 pb-2">
        Pending (3)
      </button>
      <button className="text-gray-500 hover:text-green-600">Approved (5)</button>
      <button className="text-gray-500 hover:text-green-600">Completed (12)</button>
    </div>

    {/* Request Item */}
    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center shadow">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
        <div>
          <h3 className="font-semibold">John Deere Tractor</h3>
          <p className="text-gray-500 text-sm">June 15–18, 2023 • $360</p>
        </div>
      </div>

      <div className="space-x-3">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Approve</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Decline</button>
      </div>
    </div>
  </div>

</div>

    </>
  )
}

export default DashboardCentre
