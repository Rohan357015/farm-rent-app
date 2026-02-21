import Message from "../models/message.model.js";
import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import Connection from "../models/connection.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// message_controller.js — getUsersForSidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      status: "Accepted",
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // Manually populate since sender/receiver can be Farmer or Supplier
    const populated = await Promise.all(
      connections.map(async (conn) => {
        const plainConn = conn.toObject();

        // Try Farmer first, fallback to Supplier
        plainConn.senderId =
          (await Farmer.findById(conn.senderId).select("name username profilePic")) ||
          (await Supplier.findById(conn.senderId).select("name username profilePic"));

        plainConn.receiverId =
          (await Farmer.findById(conn.receiverId).select("name username profilePic")) ||
          (await Supplier.findById(conn.receiverId).select("name username profilePic"));

        return plainConn;
      })
    );

    res.status(200).json(populated);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text} = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
