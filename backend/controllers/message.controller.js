import Message from "../models/message.model.js";
import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import Connection from "../models/connection.model.js";
import { emitToUser } from "../lib/socket.js";

const USER_SELECT = "name username profilePic image role";

const hydrateConnectionUsers = async (connections) => {
  const userIds = [
    ...new Set(
      connections
        .flatMap((conn) => [conn.senderId?.toString(), conn.receiverId?.toString()])
        .filter(Boolean)
    ),
  ];

  const [farmers, suppliers] = await Promise.all([
    Farmer.find({ _id: { $in: userIds } }).select(USER_SELECT).lean(),
    Supplier.find({ _id: { $in: userIds } }).select(USER_SELECT).lean(),
  ]);

  const usersById = new Map(
    [...farmers, ...suppliers].map((user) => [user._id.toString(), user])
  );

  return connections.map((conn) => ({
    ...conn,
    senderId: usersById.get(conn.senderId?.toString()) || conn.senderId,
    receiverId: usersById.get(conn.receiverId?.toString()) || conn.receiverId,
  }));
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      status: "Accepted",
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ updatedAt: -1 })
      .lean();

    const populated = await hydrateConnectionUsers(connections);

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
    })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text.trim(),
    });

    emitToUser(receiverId, "newMessage", newMessage);
    emitToUser(senderId, "newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
