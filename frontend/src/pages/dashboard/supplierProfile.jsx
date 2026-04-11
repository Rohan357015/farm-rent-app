import React, { useEffect, useState } from "react";
import { useConnectionStore } from "../../store/connection.store";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Star,
    CheckCircle,
    ClipboardList,
    Check,
    RefreshCcw,
    IndianRupee,
} from "lucide-react";
import { useAuthStore } from "../../store/authstore";
import FarmerNavabar from "./navBar2";
import { useSupplierAnalyticsStore } from "../../store/supplierAnalytics.store";

/* ===================== MAIN PROFILE ===================== */

export default function SupplierProfile() {
    const navigate = useNavigate();
    const { user, getSupplierDashboard, updateSupplierProfile, deleteSupplier } =
        useAuthStore();

    const [showImageModal, setShowImageModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const { connections, fetchConnections, initSocketListeners, removeSocketListeners } =
        useConnectionStore();
    const { analytics, loading: analyticsLoading, fetchSupplierAnalytics } =
        useSupplierAnalyticsStore();

    useEffect(() => {
        if (!user) {
            getSupplierDashboard();
        }
    }, [user]);

    useEffect(() => {
        if (!user?._id) return;
        fetchConnections();
        initSocketListeners();
        return () => removeSocketListeners();
    }, [user?._id, fetchConnections, initSocketListeners, removeSocketListeners]);

    useEffect(() => {
        if (!user?._id) return;
        fetchSupplierAnalytics({ page: 1, limit: 5 });
    }, [user?._id, fetchSupplierAnalytics]);

    /* ---------------- FALLBACK DATA ---------------- */

    const profile = {
        name: user?.name || "userName",
        role: user?.role || "Farmer",
        verified: true,

        rating: user?.ratings?.length
            ? (
                user.ratings.reduce((a, b) => a + b, 0) /
                user.ratings.length
            ).toFixed(1)
            : 4.8,

        reviews: user?.ratings?.length || 24,

        location:
            user?.location ||
            `${user?.Address?.city || "Pune"}, India`,

        joinDate: user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
            })
            : "January 2023",

        image:
            typeof user?.image === "string" && user.image.length > 0
                ? user.image
                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",

        about: user?.about || "Nothing To Display",
    };

    const formatCurrency = (value) =>
        `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
    const analyticsSummary = analytics?.summary || {};
    const topBookedEquipment = analytics?.topEquipment?.[0];

    const stats = [
        { label: "Total Earnings", value: formatCurrency(analyticsSummary.totalLifetime), icon: <ClipboardList /> },
        { label: "Completed Rentals", value: analyticsSummary.completedRentals || 0, icon: <Check /> },
        { label: "Active Rentals", value: user?.activerentals ?? 2, icon: <RefreshCcw /> },
        { label: "Total Income", value: "₹1,24,500", icon: <IndianRupee /> },
    ];

    const personalInfo = [
        { label: "Full Name", value: profile.name },
        { label: "Email", value: user?.email || "email@example.com" },
        { label: "Phone", value: user?.phone || "+91-XXXXXXXXXX" },
        { label: "Gender", value: user?.gender },
        { label: "Occupation", value: profile.role },
        { label: "Company Name", value: user?.companyName },
    ];

    const addressInfo = [
        { label: "Street", value: user?.Address?.street || "Street name" },
        { label: "City", value: user?.Address?.city || "City" },
        { label: "State", value: user?.Address?.state || "State" },
        { label: "Pincode", value: user?.Address?.pincode || "Pincode" },
        { label: "Country", value: user?.Address?.country || "India" },
        {
            label: "Alternate Phone",
            value: user?.Address?.alternatePhone || "+91-XXXXXXXXXX",
        },
        {
            label: "LandMark", value: user?.Address?.landmark || "India"
        }
    ];

    const paymentMethods = [
        {
            title: "Visa Card",
            detail: "**** **** **** 4242",
            meta: "Expires 12/26",
            badge: "Default",
        },
        {
            title: "UPI",
            detail: "rajesh.kumar@okhdfcbank",
            meta: "Linked to 9876543210",
            badge: "Active",
        },
    ];

    const verificationStatus = [
        { label: "Email Verified", status: true },
        { label: "Phone Verified", status: true },
        { label: "Identity Verified", status: true },
        { label: "Address Verified", status: true },
        { label: "Bank Account", status: false },
        { label: "GST Certificate", status: false },
    ];

    const recentActivity = [
        { text: "Booking #BR-2025-001 Approved", time: "2 days ago" },
        { text: "Payment of ₹12,500 received", time: "5 days ago" },
        { text: "Profile updated", time: "1 week ago" },
        { text: "New review received: 5 stars", time: "2 weeks ago" },
        { text: "Equipment returned successfully", time: "3 weeks ago" },
    ];

    /* ===================== HANDLERS ===================== */

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            deleteSupplier();
        }
    };

    /* ===================== JSX ===================== */
    const connectionLength = connections.filter((c)=>c.status==="Accepted").length;

    return (
        <>
            <FarmerNavabar />
            <div className="bg-[#F5F5F0] min-h-screen p-8 sm:p-6 lg:p-8 overflow-x-hidden">

                <h1 className="text-3xl font-bold text-green-700">User Profile</h1>
                <p className="text-gray-600 mb-6">Manage your account information</p>

                {/* PROFILE CARD */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col lg:flex-row justify-between gap-6 mb-6">
                    <div className="flex gap-6 flex-col sm:flex-col md:flex-row items-center md:items-start">
                        <img
                            src={profile.image}
                            className="w-24 h-24 rounded-full border-4 border-green-100 object-cover"
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-black">{profile.name}</h2>

                            <div className="flex gap-3 items-center mt-1">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    {profile.role}
                                </span>
                                {profile.verified && (
                                    <span className="flex items-center gap-1 text-xs bg-green-700 text-white px-2 py-1 rounded">
                                        <CheckCircle size={14} /> Verified
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-6 text-sm mt-2 text-gray-600">
                                <span className="flex items-center gap-1 text-green-700">
                                    <Star size={14} /> {profile.rating} ({profile.reviews})
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} /> {profile.location}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                Member since {profile.joinDate}
                            </p>
                            <p className="text-blue-600 text-lg font-semibold cursor-pointer "
                                onClick={() => navigate('/connections')}
                            >
                                Connections {connectionLength < 10 ? "0" + connectionLength : connectionLength};
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowImageModal(true)}
                        className="bg-green-700 text-white px-5 h-10 rounded hover:bg-green-800 w-full lg:w-auto"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* ABOUT */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-green-700 mb-2">About</h3>
                        <button
                            className="border border-green-700 px-4 py-1 text-black rounded hover:bg-green-700 hover:text-white"
                            onClick={() => setShowAboutModal(true)}
                        >
                            Edit
                        </button>
                    </div>

                    <p className="text-black text-sm mb-4">{profile.about}</p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
                        >
                            <div>
                                <h3 className="text-2xl font-bold overflow-x-auto text-green-700">{s.value}</h3>
                                <p className="text-gray-600  overflow-x-auto text-sm">{s.label}</p>
                            </div>
                            <div className="bg-green-100  overflow-x-auto rounded-lg text-green-700">
                                {s.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-700">Earnings Analytics</h3>
                            <p className="text-sm text-gray-600">
                                {analyticsLoading ? "Loading revenue trend..." : "Monthly revenue, growth and top equipment"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/supplier-earnings")}
                            className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                        >
                            View Earnings
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                            <p className="text-xs text-gray-500">Total Earnings</p>
                            <p className="mt-1 text-2xl font-bold text-green-700">
                                {formatCurrency(analyticsSummary.totalLifetime)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">{analyticsSummary.completedRentals || 0} completed rentals</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-xs text-gray-500">Monthly Earnings</p>
                            <p className="mt-1 text-2xl font-bold text-green-700">
                                {formatCurrency(analyticsSummary.thisMonth)}
                            </p>
                            <p className={`mt-1 text-xs font-semibold ${
                                (analyticsSummary.monthlyGrowthPercent || 0) >= 0 ? "text-green-700" : "text-red-600"
                            }`}>
                                {analyticsSummary.monthlyGrowthPercent || 0}% vs previous month
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-xs text-gray-500">Top Booked Equipment</p>
                            <p className="mt-1 text-lg font-semibold text-black">
                                {topBookedEquipment?.equipmentName || "No bookings yet"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                {topBookedEquipment?.bookings || 0} bookings · {formatCurrency(topBookedEquipment?.revenue)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <InfoCard
                            title="Personal Information"
                            data={personalInfo}
                            onEdit={() => setShowDetailsModal(true)}
                        />
                        <InfoCard
                            title="Address Information"
                            data={addressInfo}
                            onEdit={() => setShowDetailsModal(true)}
                        />

                        {/* PAYMENT */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-lg font-semibold text-green-700">
                                    Payment Methods
                                </h3>
                                <button className="border px-3 py-1 rounded text-sm">
                                    Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {paymentMethods.map((m, i) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="font-semibold text-black">{m.title}</h4>
                                            <span className="bg-green-100 text-green-700 px-2 rounded text-xs">
                                                {m.badge}
                                            </span>
                                        </div>
                                        <p className="text-sm text-black">{m.detail}</p>
                                        <p className="text-xs text-gray-500">{m.meta}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-green-700 mb-4">
                                Verification Status
                            </h3>
                            {verificationStatus.map((v, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2">
                                    <span className="text-black">{v.label}</span>
                                    {v.status ? (
                                        <span className="text-green-700 flex items-center gap-1">
                                            <CheckCircle size={14} /> Verified
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600">Pending</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-green-700 mb-4">
                                Recent Activity
                            </h3>
                            {recentActivity.map((a, i) => (
                                <div key={i} className="mb-3">
                                    <p className="text-black text-sm">{a.text}</p>
                                    <p className="text-gray-500 text-xs">{a.time}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow p-6 space-y-3">

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    className="border bg-yellow-800 py-2.5 rounded-lg hover:border-red-700 transition-colors font-medium text-white"
                                    onClick={() => console.log("Change Password")}
                                >
                                    Change Password
                                </button>

                                <button
                                    className="border border-gray-800 text-black py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    onClick={() => console.log("Download Data")}
                                >
                                    Download Data
                                </button>
                            </div>

                            <button
                                className="w-full border border-red-500 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </button>

                            <button
                                className="w-full border border-gray-300 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
                                onClick={() => console.log("Logout")}
                            >
                                Logout
                            </button>
                        </div>

                    </div>
                </div>

                {/* ================= MODALS ================= */}

                {showImageModal && (
                    <ProfileImageModal
                        user={user}
                        onClose={() => setShowImageModal(false)}
                        onSave={(data) => {
                            updateSupplierProfile(data);
                            setShowImageModal(false);
                        }}
                    />
                )}

                {showDetailsModal && (
                    <ProfileDetailsModal
                        user={user}
                        onClose={() => setShowDetailsModal(false)}
                        onSave={(data) => {
                            updateSupplierProfile({
                                name: data.name,
                                phone: data.phone,
                                comapnyName: data.comapnyName,
                                gender: data.gender,
                                Address: {
                                    street: data.street,
                                    city: data.city,
                                    state: data.state,
                                    pincode: data.pincode,
                                    alternatePhone: data.alternatePhone,
                                    landmark: data.landMark,
                                },
                            });
                            setShowDetailsModal(false);
                        }}
                    />
                )}

                {showAboutModal && (
                    <AboutModal
                        about={profile.about}
                        onClose={() => setShowAboutModal(false)}
                        onSave={async (newAbout) => {
                            await updateSupplierProfile({ about: newAbout });
                            setShowAboutModal(false);
                        }}
                    />
                )}

            </div>
        </>
    );
}

/* ===================== REUSABLE ===================== */

function InfoCard({ title, data, onEdit }) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-700">{title}</h3>
                <button
                    onClick={onEdit}
                    className="border border-green-700 px-4 py-1 text-black rounded hover:bg-green-700 hover:text-white"
                >
                    Edit
                </button>
            </div>
            <hr className="mb-4" />
            <div className="grid grid-cols-2 gap-4">
                {data.map((item, i) => (
                    <div key={i}>
                        <p className="text-xs text-gray-600">{item.label}</p>
                        <p className="text-sm font-medium text-black">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ===================== IMAGE MODAL ===================== */

function ProfileImageModal({ user, onClose, onSave }) {
    const [image, setImage] = useState(user?.image || null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file");
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex text-black items-center justify-center z-50">
            <div className="bg-white p-6 border border-black rounded-xl w-[380px]">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                    Update Profile Image
                </h3>

                <img
                    src={image}
                    className="w-24 h-24 rounded-full border border-black mx-auto mb-4 object-cover"
                />

                <input
                    type="file"
                    className="w-full mb-4"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="border px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (image && image.startsWith("data:image")) {
                                onSave({ image });
                            } else {
                                alert("Please select a new image");
                            }
                        }}
                        className="bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===================== DETAILS MODAL ===================== */

function ProfileDetailsModal({ user, onClose, onSave }) {
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [company, setCompany] = useState(user?.companyName || "");

    const [street, setStreet] = useState(user?.Address?.street || "");
    const [city, setCity] = useState(user?.Address?.city || "");
    const [state, setState] = useState(user?.Address?.state || "");
    const [pincode, setPincode] = useState(user?.Address?.pincode || "");
    const [alternatePhone, setAlternatePhone] = useState(user?.Address?.alternatePhone || "");
    const [landMark, setLandMark] = useState(user?.Address?.landmark || "");

    return (
        <div className="fixed inset-0 bg-black/40 flex text-black items-center justify-center z-50">
            <div className="bg-white p-6 border border-black rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                    Edit Details
                </h3>

                <div className="space-y-3">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="CompanyName" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="tel" placeholder="Alternate Phone" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} className="w-full border rounded p-2 text-black" />
                    <input type="text" placeholder="Landmark" value={landMark} onChange={(e) => setLandMark(e.target.value)} className="w-full border rounded p-2 text-black" />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="border px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({ name, phone, gender, street, company, city, state, pincode, alternatePhone, landMark })}
                        className="bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===================== ABOUT MODAL ===================== */

function AboutModal({ about, onClose, onSave }) {
    const [value, setValue] = useState(about || "");

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[500px]">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                    Edit About
                </h3>

                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={5}
                    className="w-full border rounded p-3 text-black resize-none"
                    placeholder="Write something about yourself..."
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(value)}
                        className="bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
