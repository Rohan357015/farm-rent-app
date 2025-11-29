import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/landingPage";
import FarmerLogin from "./pages/farmerlogin";
import SupplierLogin from "./pages/supplerlogin";
import FarmerRegister from "./pages/FarmerRegister";
import SupplierRegister from "./pages/SupplierRegister";
import { ThemeProvider } from "next-themes";
import FarmerDashboard from "./pages/dashboard/farmerDashboard.jsx";
import SupplierDashboard from "./pages/dashboard/supplierDashboard.jsx";
import Equipmentsforms from "./pages/forms/equipments.forms.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EquipmentDetails from "./pages/equipment-page.jsx";

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
        <Route path="/farmer-dashboard" element={<ProtectedRoute allowedRole="farmer"><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/supplier-dashboard" element={<ProtectedRoute allowedRole="supplier"><SupplierDashboard /></ProtectedRoute>} />
        <Route path="/equipments-form" element={<Equipmentsforms />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
      </Routes>
      <Toaster />
     
    </div>
    </ThemeProvider>
  );
}

export default App;