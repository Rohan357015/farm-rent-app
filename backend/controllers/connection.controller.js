import express from "express";
import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import Connection from "../models/connection.model.js";

const USER_SELECT = "name email image role";

const hydrateConnections = async (connections) => {
  const farmerIds = new Set();
  const supplierIds = new Set();

  connections.forEach((conn) => {
    const senderSet = conn.senderRole === "farmer" ? farmerIds : supplierIds;
    const receiverSet = conn.receiverRole === "farmer" ? farmerIds : supplierIds;
    senderSet.add(conn.senderId.toString());
    receiverSet.add(conn.receiverId.toString());
  });

  const [farmers, suppliers] = await Promise.all([
    Farmer.find({ _id: { $in: Array.from(farmerIds) } }).select(USER_SELECT).lean(),
    Supplier.find({ _id: { $in: Array.from(supplierIds) } }).select(USER_SELECT).lean(),
  ]);

  const farmersById = new Map(farmers.map((user) => [user._id.toString(), user]));
  const suppliersById = new Map(suppliers.map((user) => [user._id.toString(), user]));

  return connections.map((conn) => {
    const senderMap = conn.senderRole === "farmer" ? farmersById : suppliersById;
    const receiverMap = conn.receiverRole === "farmer" ? farmersById : suppliersById;

    return {
      ...conn,
      sender: senderMap.get(conn.senderId.toString()) || null,
      receiver: receiverMap.get(conn.receiverId.toString()) || null,
    };
  });
};

/* ===========================
   SEND CONNECTION REQUEST
=========================== */
export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;
    const senderRole = req.user.role;
    const receiverRole = senderRole === "farmer" ? "supplier" : "farmer";

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const existing = await Connection.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "Connection already exists" });
    }

    const newConnection = await Connection.create({
      senderId,
      receiverId,
      senderRole,
      receiverRole
    });

    const io = req.app.get("io");
    io.to(receiverId.toString()).emit("new-connection-request", newConnection);

    res.status(201).json({
      message: "Connection request sent successfully",
      connection: newConnection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===========================
   GET CONNECTIONS
=========================== */
export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
        status: { $in: ["Pending", "Accepted"] }
    })
      .sort({ updatedAt: -1 })
      .lean();

    const populatedConnections = await hydrateConnections(connections);

    const io = req.app.get("io");
    io.to(userId.toString()).emit("connections-updated", populatedConnections);

    res.status(200).json({
      message: "Connections fetched successfully",
      connections: populatedConnections
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===========================
   ACCEPT CONNECTION
=========================== */
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    connection.status = "Accepted";
    await connection.save();

    const io = req.app.get("io");
    io.to(connection.senderId.toString()).emit("connection-accepted", connection);
    io.to(connection.receiverId.toString()).emit("connection-accepted", connection);

    res.status(200).json({
      message: "Connection accepted successfully",
      connection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===========================
   REJECT CONNECTION
=========================== */
export const declineConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    connection.status = "Rejected";
    await connection.save();

    const io = req.app.get("io");
    io.to(connection.senderId.toString()).emit("connection-rejected", connection);

    res.status(200).json({
      message: "Connection rejected successfully",
      connection
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===========================
   REMOVE CONNECTION
=========================== */
export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.user.id;

    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      status: "Accepted",
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const io = req.app.get("io");
    io.to(connection.senderId.toString()).emit("connection-removed", connection);
    io.to(connection.receiverId.toString()).emit("connection-removed", connection);

    res.status(200).json({ message: "Connection removed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===========================
   WITHDRAW REQUEST
=========================== */
export const withdrawRequest = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.user.id;

    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      senderId: userId,
      status: "Pending"
    });

    if (!connection) {
      return res.status(404).json({ message: "No pending request found" });
    }

    const io = req.app.get("io");
    io.to(connection.receiverId.toString()).emit("connection-withdrawn", connection);

    res.status(200).json({ message: "Connection request withdrawn successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const globalUserSearch = async (req, res) => {
  try {
    const [farmers, suppliers] = await Promise.all([
      Farmer.find().select("_id name image role").sort({ name: 1 }).lean(),
      Supplier.find().select("_id name image role").sort({ name: 1 }).lean(),
    ]);

    const users = [...farmers, ...suppliers];

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};
            


export const getPublicUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    let user =
      (await Farmer.findById(id)) ||
      (await Supplier.findById(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

