import { useEffect, useState } from "react";
import { useConnectionStore } from "../store/connection.store";
import { useAuthStore } from "../store/authstore";
import defaultAvatar from "../assets/default-avtar.png";
import { useNavigate } from "react-router-dom";
import FarmerNavBar from "./dashboard/navBar2.jsx";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const {
    connections,
    loading,
    fetchConnections,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    withdrawRequest,
  } = useConnectionStore();

  const { user } = useAuthStore();
  const currentUserId = user?._id;

  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections.filter((conn) => {
    if (activeTab === "Connected") return conn.status === "Accepted";
    if (activeTab === "Received")
      return conn.status === "Pending" && conn.receiverId === currentUserId;
    if (activeTab === "Sent")
      return conn.status === "Pending" && conn.senderId === currentUserId;
    return true;
  });

  const tabCounts = {
    All: connections.length,
    Connected: connections.filter((c) => c.status === "Accepted").length,
    Received: connections.filter((c) => c.status === "Pending" && c.receiverId === currentUserId).length,
    Sent: connections.filter((c) => c.status === "Pending" && c.senderId === currentUserId).length,
  };

  const statusColors = {
    Accepted: "bg-green-100 text-green-800 border-green-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

    return (
      <>
        <FarmerNavBar />
     
      <div className="min-h-screen bg-yellow-50 p-4 md:p-8 font-sans">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black tracking-tight">My Network</h1>
          <p className="text-sm text-gray-500 mt-1">{connections.length} total connections</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Connected", "Received", "Sent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-black border-yellow-200 hover:border-green-400 hover:bg-yellow-100"
              }`}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab ? "bg-green-500 text-white" : "bg-yellow-100 text-gray-600"
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading connections...</p>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 border border-yellow-200">
              <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <p className="text-black font-semibold">No connections found</p>
            <p className="text-gray-500 text-sm mt-1">Try a different tab or connect with new people.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConnections.map((conn) => {
              const isSender = conn.senderId === currentUserId;
              const person = isSender ? conn.receiver : conn.sender;

              return (
                <div
                  key={conn._id}
                  className="bg-white border border-yellow-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Left — Person Info */}
                  <div className="flex items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/user/${person._id}`)}
                  >
                    {/* Avatar placeholder */}
                    <div className="w-11 h-11 rounded-full bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
                      <img src={person?.image || defaultAvatar} alt={person?.name} className="w-10 h-10 rounded-full object-cover" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-black text-base leading-tight">
                        {person?.name}
                      </h2>
                      <p className="text-sm text-gray-500">{person?.email}</p>
                      <span
                        className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          statusColors[conn.status] || "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {conn.status}
                      </span>
                    </div>
                  </div>

                  {/* Right — Actions */}
                  <div className="flex gap-2 flex-shrink-0">

                    {/* Incoming request */}
                    {conn.status === "Pending" && conn.receiverId === currentUserId && (
                      <>
                        <button
                          onClick={() => acceptConnectionRequest(conn._id)}
                          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => declineConnectionRequest(conn._id)}
                          className="bg-white hover:bg-red-50 active:bg-red-100 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Decline
                        </button>
                      </>
                    )}

                    {/* Sent request */}
                    {conn.status === "Pending" && conn.senderId === currentUserId && (
                      <button
                        onClick={() => withdrawRequest(conn._id)}
                        className="bg-white hover:bg-yellow-50 text-black border border-yellow-200 hover:border-yellow-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Withdraw
                      </button>
                    )}

                    {/* Connected */}
                    {conn.status === "Accepted" && (
                      <button
                        onClick={() => removeConnection(conn._id)}
                        className="bg-white hover:bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                        </svg>
                        Remove
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
       </>
    );
}