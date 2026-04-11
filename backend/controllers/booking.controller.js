import Booking from "../models/booking.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const REVENUE_STATUSES = ["Approved", "Completed"];
const PAYOUT_PENDING_STATUS = "Approved";

const startOfUtcMonth = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const addUtcMonths = (date, count) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1));

const buildDateRange = ({ from, to } = {}) => {
  const filter = {};
  const start = from ? new Date(from) : null;
  const end = to ? new Date(to) : null;

  if (start && !Number.isNaN(start.getTime())) {
    filter.$gte = start;
  }

  if (end && !Number.isNaN(end.getTime())) {
    end.setUTCHours(23, 59, 59, 999);
    filter.$lte = end;
  }

  return Object.keys(filter).length ? filter : null;
};

const getGrowthPercent = (currentValue, previousValue) => {
  if (!previousValue && currentValue > 0) return 100;
  if (!previousValue) return 0;
  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
};

// These statuses block new overlapping bookings
const BLOCKING_STATUSES = ["Pending", "Approved", "Confirmed", "InUse"];

// Overlap rule:
// existing.startDate <= newEndDate AND existing.endDate >= newStartDate
const hasDateConflict = async ({ productId, startDate, endDate }) => {
  const conflict = await Booking.findOne({
    product: productId,
    status: { $in: BLOCKING_STATUSES },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });

  return !!conflict;
};

export const checkAvailability = async (req, res) => {
  try {
    const equipmentId = req.query.equipmentId || req.query.productId;
    const { startDate, endDate } = req.query;

    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({ message: "equipmentId, startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const conflict = await hasDateConflict({
      productId: equipmentId,
      startDate: start,
      endDate: end,
    });

    if (conflict) {
      return res.status(200).json({
        available: false,
        message: "Equipment already booked",
      });
    }

    return res.status(200).json({ available: true });
  } catch (error) {
    console.error("checkAvailability error:", error.message);
    return res.status(500).json({ message: "Failed to check availability" });
  }
};

// Create booking
export const addBooking = async (req, res) => {
  try {
    const productId = req.params.id;
    const farmerId = req.user.id;

    const product = await Product.findById(productId).select("supplier").lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { pickUpLocation, returnLocation, purpose } = req.body;
    if (!pickUpLocation?.trim() || !returnLocation?.trim() || !purpose?.trim()) {
      return res.status(400).json({
        message: "Pickup location, return location and purpose are required",
      });
    }

    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // Check overlap before create
    const conflict = await hasDateConflict({
      productId,
      startDate: start,
      endDate: end,
    });

    if (conflict) {
      return res.status(400).json({
        message: "Equipment already booked for selected dates",
      });
    }

    const supplierId = product.supplier;

    const booking = new Booking({
      product: productId,
      farmer: farmerId,
      supplier: supplierId,
      startDate: start,
      endDate: end,
      pickUpLocation: pickUpLocation.trim(),
      returnLocation: returnLocation.trim(),
      purpose: purpose.trim(),
      operators: Boolean(req.body.operators),
      deliveryAndPickup: Boolean(req.body.deliveryAndPickup),
      totalPrice: Number(req.body.totalPrice) || 0,
    });

    await booking.save();

    const io = req.app.get("io");

    // Legacy event (already used in frontend)
    io.emit("new-booking", booking);

    // New event for clean booking realtime channel
    io.emit("bookingCreated", {
      bookingId: booking._id,
      equipmentId: booking.product,
      renterId: booking.farmer,
      ownerId: booking.supplier,
      status: booking.status,
      startDate: booking.startDate,
      endDate: booking.endDate,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

export const getFarmerBookings = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const summaryOnly = req.query.summary === "true";
    if (!farmerId) {
      return res.status(400).json({ message: "Invalid Farmer ID" });
    }

    if (summaryOnly) {
      const [total, active] = await Promise.all([
        Booking.countDocuments({ farmer: farmerId }),
        Booking.countDocuments({ farmer: farmerId, status: "Approved" }),
      ]);

      return res.status(200).json({ total, active, bookings: [] });
    }

    const bookings = await Booking.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .populate("product", "equipmentName category images pricing location")
      .populate("supplier", "name email phone location")
      .lean();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get Farmer Bookings Error:", error);
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");

    // Keep old and new events both
    io.emit("booking-updated", { bookingId: booking._id, status: "Cancelled" });
    io.emit("bookingStatusUpdated", { bookingId: booking._id, status: "Cancelled" });
    io.emit("bookingCancelled", { bookingId: booking._id, status: "Cancelled" });

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierRequest = async (req, res) => {
  try {
    const SupplierId = req.user.id;

    const bookings = await Booking.find({
      supplier: SupplierId,
      status: { $ne: "Cancelled" },
    })
      .populate("product")
      .populate("farmer");

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierEarningsAnalytics = async (req, res) => {
  try {
    const supplierId = new mongoose.Types.ObjectId(req.user.id);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const now = new Date();
    const thisMonthStart = startOfUtcMonth(now);
    const nextMonthStart = addUtcMonths(thisMonthStart, 1);
    const lastMonthStart = addUtcMonths(thisMonthStart, -1);
    const historyDateRange = buildDateRange({ from: req.query.from, to: req.query.to });

    const revenueMatch = {
      supplier: supplierId,
      status: { $in: REVENUE_STATUSES },
    };
    const historyMatch = { ...revenueMatch };

    if (historyDateRange) {
      historyMatch.createdAt = historyDateRange;
    }

    const [
      lifetimeAgg,
      thisMonthAgg,
      lastMonthAgg,
      pendingPayoutAgg,
      completedRentals,
      dailyBreakdown,
      weeklyBreakdown,
      monthlyBreakdown,
      topEquipment,
      historyRows,
      historyTotal,
    ] = await Promise.all([
      Booking.aggregate([
        { $match: revenueMatch },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            ...revenueMatch,
            createdAt: { $gte: thisMonthStart, $lt: nextMonthStart },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        {
          $match: {
            ...revenueMatch,
            createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { supplier: supplierId, status: PAYOUT_PENDING_STATUS } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Booking.countDocuments({ supplier: supplierId, status: "Completed" }),
      Booking.aggregate([
        { $match: historyMatch },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
            revenue: { $sum: "$totalPrice" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $match: historyMatch },
        {
          $group: {
            _id: { year: { $isoWeekYear: "$createdAt" }, week: { $isoWeek: "$createdAt" } },
            revenue: { $sum: "$totalPrice" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.week": 1 } },
      ]),
      Booking.aggregate([
        { $match: historyMatch },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "UTC" } },
            revenue: { $sum: "$totalPrice" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        {
          $match: {
            ...revenueMatch,
            createdAt: { $gte: lastMonthStart, $lt: nextMonthStart },
          },
        },
        {
          $group: {
            _id: "$product",
            revenue: { $sum: "$totalPrice" },
            bookings: { $sum: 1 },
            completedBookings: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
            lastBookedAt: { $max: "$createdAt" },
          },
        },
        { $sort: { revenue: -1, bookings: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            equipmentId: "$_id",
            equipmentName: "$product.equipmentName",
            category: "$product.category",
            image: { $arrayElemAt: ["$product.images", 0] },
            revenue: 1,
            bookings: 1,
            completedBookings: 1,
            utilization: {
              $min: [100, { $round: [{ $multiply: [{ $divide: ["$bookings", 30] }, 100] }, 0] }],
            },
            lowUsage: { $lt: ["$bookings", 2] },
            lastBookedAt: 1,
          },
        },
      ]),
      Booking.find(historyMatch)
        .select("product farmer startDate endDate totalPrice status createdAt")
        .populate("product", "equipmentName category images")
        .populate("farmer", "name email phone image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(historyMatch),
    ]);

    const totalLifetime = lifetimeAgg[0]?.total || 0;
    const thisMonth = thisMonthAgg[0]?.total || 0;
    const lastMonth = lastMonthAgg[0]?.total || 0;
    const pendingPayouts = pendingPayoutAgg[0]?.total || 0;

    res.set("Cache-Control", "private, max-age=30");
    return res.status(200).json({
      summary: {
        totalLifetime,
        thisMonth,
        lastMonth,
        monthlyGrowthPercent: getGrowthPercent(thisMonth, lastMonth),
        pendingPayouts,
        pendingPayoutCount: pendingPayoutAgg[0]?.count || 0,
        completedRentals,
        totalPaidBookings: lifetimeAgg[0]?.count || 0,
      },
      breakdowns: {
        daily: dailyBreakdown.map((item) => ({
          label: item._id,
          revenue: item.revenue || 0,
          bookings: item.bookings || 0,
        })),
        weekly: weeklyBreakdown.map((item) => ({
          label: `${item._id.year}-W${item._id.week}`,
          revenue: item.revenue || 0,
          bookings: item.bookings || 0,
        })),
        monthly: monthlyBreakdown.map((item) => ({
          label: item._id,
          revenue: item.revenue || 0,
          bookings: item.bookings || 0,
        })),
      },
      topEquipment,
      transactions: {
        bookings: historyRows,
        page,
        limit,
        total: historyTotal,
        hasMore: skip + historyRows.length < historyTotal,
      },
    });
  } catch (error) {
    console.error("Supplier earnings analytics error:", error);
    res.status(500).json({ message: "Failed to load supplier earnings analytics" });
  }
};

export const declineRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = req.user.id;

    const booking = await Booking.findOneAndUpdate(
      { _id: id, supplier: supplierId },
      { status: "Rejected" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");
    io.emit("booking-updated", { bookingId: booking._id, status: "Rejected" });
    io.emit("bookingStatusUpdated", { bookingId: booking._id, status: "Rejected" });

    res.status(200).json({
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = req.user.id;

    const booking = await Booking.findOneAndUpdate(
      { _id: id, supplier: supplierId },
      { status: "Approved" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");
    io.emit("booking-updated", { bookingId: booking._id, status: "Approved" });
    io.emit("bookingStatusUpdated", { bookingId: booking._id, status: "Approved" });

    res.status(200).json({
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CompleteBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");
    io.emit("booking-updated", { bookingId: booking._id, status: "Completed" });
    io.emit("bookingStatusUpdated", { bookingId: booking._id, status: "Completed" });

    res.status(200).json({
      message: "Booking Completed successfully",
      booking,
    });
  } catch (error) {
    console.error("complete booking error:", error.message);
    res.status(500).json({ message: "Failed to complete booking" });
  }
};

export const clearBookingHistory = async (req, res) => {
  try {
    const farmerId = req.user.id;
    await Booking.deleteMany({ farmer: farmerId, status: "Completed" });
    res.status(200).json({ message: "Booking history cleared" });
  } catch (error) {
    console.error("Clear Booking History Error:", error.message);
    res.status(500).json({ message: "Failed to clear booking history" });
  }
};
