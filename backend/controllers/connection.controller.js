import express from "express";
import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import Connection from "../models/connection.model.js";


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
    });
    const populatedConnections = await Promise.all(
      connections.map(async (conn) => {
        let senderData, receiverData;

        if (conn.senderRole === "farmer") {
          senderData = await Farmer.findById(conn.senderId).select("name email");
        } else {
          senderData = await Supplier.findById(conn.senderId).select("name email");
        }

        if (conn.receiverRole === "farmer") {
          receiverData = await Farmer.findById(conn.receiverId).select("name email");
        } else {
          receiverData = await Supplier.findById(conn.receiverId).select("name email");
        }

        return {
          ...conn._doc,
          sender: senderData,
          receiver: receiverData
        };
      })
    );

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
    const farmers = await Farmer.find().select("_id name image role");
    const suppliers = await Supplier.find().select("_id name image role");

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

