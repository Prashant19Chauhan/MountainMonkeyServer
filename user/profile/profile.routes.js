import express from "express";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";
import { updateProfile, deleteProfile, getProfile } from "./profile.controllers.js";

const router = express.Router();

router.post("/", authMiddleware(["user"], ["user"] ), updateProfile);
router.get("/", authMiddleware(["user"], ["user"] ), getProfile);
router.delete("/", authMiddleware(["user"], ["user"] ), deleteProfile);

export default router;