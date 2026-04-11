import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/landingPage";
import FarmerLogin from "./pages/farmerlogin";
import SupplierLogin from "./pages/supplerlogin";
import FarmerRegister from "./pages/FarmerRegister";
import SupplierRegister from "./pages/SupplierRegister";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuthStore } from "./store/authstore.js";
import { useShallow } from "zustand/react/shallow";
import { useBookingStore } from "./store/booking.store.js";
import { socket } from "./lib/socket.js";

const FarmerDashboard = React.lazy(() => import("./pages/dashboard/farmerDashboard.jsx"));
const SupplierDashboard = React.lazy(() => import("./pages/dashboard/supplierDashboard.jsx"));
const Equipmentsforms = React.lazy(() => import("./pages/forms/equipments.forms.jsx"));
const EquipmentDetails = React.lazy(() => import("./pages/equipment-page.jsx"));
const SupplierEquipment = React.lazy(() => import("./pages/utilityPages/SupplierEquipment.jsx"));
const BookingForm = React.lazy(() => import("./pages/forms/bookingForm.jsx"));
const CartPage = React.lazy(() => import("./pages/cartPage.jsx"));
const FarmerBookings = React.lazy(() => import("./pages/rentalPage.jsx"));
const RentalRequest = React.lazy(() => import("./pages/rentalRequest.jsx"));
const FarmerProfileCard = React.lazy(() => import("./pages/dashboard/farmerprofile.jsx"));
const SupplierProfile = React.lazy(() => import("./pages/dashboard/supplierProfile.jsx"));
const ConnectionsPage = React.lazy(() => import("./pages/connectionPage.jsx"));
const PublicUserProfile = React.lazy(() => import("./pages/userinfopage.jsx"));
const MessageBox = React.lazy(() => import("./pages/message.jsx"));
const SupplierEarnings = React.lazy(() => import("./pages/SupplierEarnings.jsx"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-yellow-50 p-6 text-center text-black">
          <div>
            <h1 className="text-2xl font-semibold text-green-700">Something went wrong</h1>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-white"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { checkAuth, checkingAuth, user } = useAuthStore(
    useShallow((state) => ({
      checkAuth: state.checkAuth,
      checkingAuth: state.checkingAuth,
      user: state.user,
    }))
  );

  const { initSocket } = useBookingStore();

  React.useEffect(() => {
    initSocket();
  }, []);

  // Attach userId to socket after login for stable realtime events
  React.useEffect(() => {
    if (user?._id) {
      socket.auth = { userId: user._id };
      socket.io.opts.query = { userId: user._id };
      if (!socket.connected) {
        socket.connect();
      }
    } else if (socket.connected) {
      socket.disconnect();
    }
  }, [user?._id]);

  React.useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class">
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <ErrorBoundary>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/farmer-login" element={<FarmerLogin />} />
          <Route path="/supplier-login" element={<SupplierLogin />} />
          <Route path="/farmer-register" element={<FarmerRegister />} />
          <Route path="/supplier-register" element={<SupplierRegister />} />

          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supplier-dashboard"
            element={
              <ProtectedRoute allowedRole="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/equipments-form" element={<Equipmentsforms />} />
          <Route path="/equipments-form/:id" element={<Equipmentsforms />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />

          <Route
            path="/supplier-equipments"
            element={user ? <ProtectedRoute allowedRole="supplier"><SupplierEquipment /></ProtectedRoute> : <SupplierLogin />}
          />

          <Route
            path="/booking-form/:id"
            element={user ? <ProtectedRoute allowedRole="farmer"><BookingForm /></ProtectedRoute> : <FarmerLogin />}
          />

          <Route
            path="/cart"
            element={user ? <ProtectedRoute allowedRole="farmer"><CartPage /></ProtectedRoute> : <FarmerLogin />}
          />

          <Route
            path="/farmer-bookings"
            element={user ? <ProtectedRoute allowedRole="farmer"><FarmerBookings /></ProtectedRoute> : <FarmerLogin />}
          />

          <Route
            path="/supplier-rentals"
            element={user ? <ProtectedRoute allowedRole="supplier"><RentalRequest /></ProtectedRoute> : <SupplierLogin />}
          />

          <Route
            path="/farmer-profile"
            element={user ? <ProtectedRoute allowedRole="farmer"><FarmerProfileCard /></ProtectedRoute> : <FarmerLogin />}
          />

          <Route
            path="/supplier-profile"
            element={user ? <ProtectedRoute allowedRole="supplier"><SupplierProfile /></ProtectedRoute> : <SupplierLogin />}
          />

          <Route
            path="/supplier-earnings"
            element={user ? <ProtectedRoute allowedRole="supplier"><SupplierEarnings /></ProtectedRoute> : <SupplierLogin />}
          />

          <Route path="/connections" element={user ? <ConnectionsPage /> : <FarmerLogin />} />
          <Route path="/user/:id" element={<PublicUserProfile />} />
          <Route path="/user/message" element={<MessageBox />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
