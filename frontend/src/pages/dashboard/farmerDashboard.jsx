import React from "react";
import FarmerNavabar from "./navBar2.jsx";
import EquipmentBrowser from "./featured.jsx";

const FarmerDashboard = () => {
  return (
    <div className="min-h-screen bg-[#12152D] text-white relative">
      <FarmerNavabar/>
      <div className="bg-yellow-50 text-black min-h-screen w-full
                      overflow-y-auto flex flex-col items-center relative"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <EquipmentBrowser />
      </div>
    </div>
  );
};

export default FarmerDashboard;
