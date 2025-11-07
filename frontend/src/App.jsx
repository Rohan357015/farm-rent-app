import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/landingPage";
import FarmerLogin from "./pages/farmerlogin";
import SupplierLogin from "./pages/supplerlogin";
import FarmerRegister from "./pages/FarmerRegister";
import SupplierRegister from "./pages/SupplierRegister";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/supplier-login" element={<SupplierLogin />} />
        <Route path="/farmer-register" element={<FarmerRegister />} />
        <Route path="/supplier-register" element={<SupplierRegister />} />
      </Routes>
    </div>
  );
}

export default App;