import express from "express";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";
import { createEnquiry } from "./enquiry.controllers.js";

const router = express.Router();

router.post("/", authMiddleware(["user"], ["user"]), createEnquiry);

export default router;
