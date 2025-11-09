import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/landingPage";
import FarmerLogin from "./pages/farmerlogin";
import SupplierLogin from "./pages/supplerlogin";
import FarmerRegister from "./pages/FarmerRegister";
import SupplierRegister from "./pages/SupplierRegister";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class">
    <div >
      
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/supplier-login" element={<SupplierLogin />} />
        <Route path="/farmer-register" element={<FarmerRegister />} />
        <Route path="/supplier-register" element={<SupplierRegister />} />
      </Routes>
      <Toaster />
     
    </div>
    </ThemeProvider>
  );
}

export default App;