import express from "express";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";
import { createEnquiry, getMyEnquiries } from "./enquiry.controllers.js";

const router = express.Router();

router.post("/", authMiddleware(["user"], ["user"]), createEnquiry);
router.get("/my-enquiries", authMiddleware(["user"], ["user"]), getMyEnquiries);

export default router;
