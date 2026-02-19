import express from "express";
import { sendConnectionRequest, getConnections, acceptConnectionRequest ,declineConnectionRequest,removeConnection,withdrawRequest,globalUserSearch} from "../controllers/connection.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";

const connectionRouter = express.Router();

connectionRouter.post("/connections/request", ProtectRoute, sendConnectionRequest);
connectionRouter.get("/connections", ProtectRoute, getConnections);
connectionRouter.post("/connections/accept", ProtectRoute, acceptConnectionRequest);
connectionRouter.post("/connections/decline", ProtectRoute, declineConnectionRequest);
connectionRouter.post("/connections/remove", ProtectRoute, removeConnection);
connectionRouter.post("/connections/withdraw", ProtectRoute, withdrawRequest);
connectionRouter.get("/user/search", ProtectRoute, globalUserSearch);    
export default connectionRouter;