import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authstore";
import defaultAvatar from "../assets/default-avtar.png";
import FarmerNavBar from "./dashboard/navBar2.jsx";
import { useConnectionStore } from "../store/connection.store";

const PublicUserProfile = () => {
  const { id } = useParams();
  const { getPublicProfile, getFarmerDashboard, getSupplierDashboard, user } = useAuthStore();
  const {sendConnectionRequest} = useConnectionStore();
  const [stats, setStats] = useState({
    completedRentals: 0,
    activeRentals: 0,
    totalBookings: 0,
    rating: "—",
  });

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublicProfile(id);
      setUserInfo(data);
    };
    fetchData();
  }, [id]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FarmerNavBar />
    
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 font-sans">

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 flex flex-col md:flex-row items-center gap-6">

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={userInfo.image || defaultAvatar}
            alt={userInfo.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-yellow-200 shadow"
          />
          {userInfo.verified && (
            <span className="absolute bottom-1 right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-black tracking-tight">
            {userInfo.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
            <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-black rounded-full capitalize border border-yellow-200">
              {userInfo.role}
            </span>
            {userInfo.verified && (
              <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-200">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="mt-2 space-y-0.5">
            {userInfo.location && (
              <p className="text-sm text-gray-600 flex items-center gap-1 justify-center md:justify-start">
                <span>📍</span> {userInfo.location}
              </p>
            )}
            {userInfo.email && (
              <p className="text-sm text-gray-600 flex items-center gap-1 justify-center md:justify-start">
                <span>✉️</span> {userInfo.email}
              </p>
            )}
            {userInfo.gender && (
              <p className="text-sm text-gray-600 flex items-center gap-1 justify-center md:justify-start">
                <span>👤</span> {userInfo.gender}
              </p>
            )}
            {userInfo.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                Member since {new Date(userInfo.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <button className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Message
          </button>
          <button className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow flex items-center gap-2"
          onClick={() => sendConnectionRequest(userInfo._id)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            
            Connect
          </button>
        </div>
      </div>

      {/* ABOUT SECTION */}
      {userInfo.about && (
        <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 mt-5">
          <h2 className="text-base font-bold text-black mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
            About
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{userInfo.about}</p>
        </div>
      )}

      {/* SKILLS / SPECIALIZATION */}
      {userInfo.skills && userInfo.skills.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 mt-5">
          <h2 className="text-base font-bold text-black mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
            Specializations
          </h2>
          <div className="flex flex-wrap gap-2">
            {userInfo.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-full transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ADDRESS */}
      {userInfo.Address && (
        <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 mt-5">
          <h2 className="text-base font-bold text-black mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-500 rounded-full inline-block" />
            Address
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "City", value: userInfo.Address?.city },
              { label: "Street", value: userInfo.Address?.street },
              { label: "State", value: userInfo.Address?.state },
              { label: "Pincode", value: userInfo.Address?.pincode },
              { label: "Country", value: userInfo.Address?.country },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-black font-semibold mt-0.5">{value}</p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        {[
          { label: "Completed Rentals", value: stats.completedRentals || 0, icon: "✅" },
          { label: "Active Rentals", value: stats.activeRentals || 0, icon: "🔄" },
          { label: "Total Bookings", value: stats.totalBookings || 0, icon: "📋" },
          { label: "Rating", value: stats.rating || "—", icon: "⭐" },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-5 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-1">{icon}</div>
            <h3 className="text-2xl font-bold text-green-600">{value}</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

    </div>
    </>
  );
};

export default PublicUserProfile;