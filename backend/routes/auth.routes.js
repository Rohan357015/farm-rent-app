import express from "express";
import { refreshAccessToken } from "../utils/token.js";

const router = express.Router();

router.post("/refresh-token", refreshAccessToken);

export default router;
