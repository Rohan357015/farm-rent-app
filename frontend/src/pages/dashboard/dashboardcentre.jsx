import React from 'react'
import { useNavigate } from 'react-router-dom'

function DashboardCentre() {
    const navigate = useNavigate();
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
        <p className="text-xl font-semibold">12</p>
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
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg" onClick={()=>navigate("/equipments-form")}>+ Add Equipment</button>
    </div>

    <div className="grid grid-cols-3 gap-5">

      {/* card */}
      <div className="bg-gray-50 p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition">
        <div className="h-28 bg-gray-200 rounded-lg mb-3"></div>

        <h3 className="font-semibold text-gray-800">John Deere Tractor</h3>
        <p className="text-gray-500 text-sm">Model 5075E</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-green-600 font-semibold">$120/day</span>
          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
            Available
          </span>
        </div>
      </div>

      {/* card */}
      <div className="bg-gray-50 p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition">
        <div className="h-28 bg-gray-200 rounded-lg mb-3"></div>

        <h3 className="font-semibold text-gray-800">Hay Baler</h3>
        <p className="text-gray-500 text-sm">New Holland</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-green-600 font-semibold">$85/day</span>
          <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
            Rented
          </span>
        </div>
      </div>

      {/* card */}
      <div className="bg-gray-50 p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition">
        <div className="h-28 bg-gray-200 rounded-lg mb-3"></div>

        <h3 className="font-semibold text-gray-800">Seed Drill</h3>
        <p className="text-gray-500 text-sm">Case IH</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-green-600 font-semibold">$75/day</span>
          <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
            Maintenance
          </span>
        </div>
      </div>

    </div>

    <div className="text-center mt-4">
      <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
        View All Equipment
      </button>
    </div>
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
