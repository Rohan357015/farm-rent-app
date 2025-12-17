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
import { useAuthStore } from "./store/authstore.js";
import SupplierEquipment from "./pages/utilityPages/SupplierEquipment.jsx";
import BookingForm from "./pages/forms/bookingForm.jsx";
import CartPage from "./pages/cartPage.jsx";
import FarmerBookings from "./pages/rentalPage.jsx";
function App() {
  const { checkAuth, checkingAuth, user } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }
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
        <Route path="/farmer-dashboard" element={ user?<ProtectedRoute allowedRole="farmer"><FarmerDashboard /></ProtectedRoute> : <FarmerLogin />} />
        <Route path="/supplier-dashboard" element={ user?<ProtectedRoute allowedRole="supplier"><SupplierDashboard /></ProtectedRoute> : <SupplierLogin />} />
        <Route path="/equipments-form" element={<Equipmentsforms />} />
        <Route path="/equipments-form/:id" element={<Equipmentsforms />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/supplier-equipments" element={ user?<ProtectedRoute allowedRole="supplier"><SupplierEquipment /></ProtectedRoute> : <SupplierLogin />} />
        <Route path="/booking-form/:id" element={ user?<ProtectedRoute allowedRole="farmer"><BookingForm /></ProtectedRoute> : <FarmerLogin />} />
        
        <Route path="/farmer-bookings" element={ user ? <ProtectedRoute allowedRole="farmer"><FarmerBookings /></ProtectedRoute> : <FarmerLogin />} />
        
      </Routes>
      <Toaster />
     
    </div>
    </ThemeProvider>
  );
}

export default App;