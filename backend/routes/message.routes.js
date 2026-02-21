import express from "express";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { getMessages,getUsersForSidebar,sendMessage } from "../controllers/message.controller.js";

const msgrouter = express.Router();
msgrouter.get("/users", ProtectRoute, getUsersForSidebar);
msgrouter.get("/:id", ProtectRoute, getMessages);
msgrouter.post("/send/:id", ProtectRoute, sendMessage);
export default msgrouter;
