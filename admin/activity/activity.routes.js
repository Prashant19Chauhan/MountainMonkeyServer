import express from "express";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivity,
  getAllActivities,
  updateActivityCurrentPrice
} from "./activity.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.post("/", authMiddleware(["admin"], ["admin"]), createActivity);
router.put("/:slug", authMiddleware(["admin"], ["admin"]), updateActivity);
router.patch("/:slug/current-price", authMiddleware(["admin"], ["admin"]), updateActivityCurrentPrice);
router.delete("/:slug", authMiddleware(["admin"], ["admin"]), deleteActivity);
router.get("/:slug", authMiddleware(["admin"], ["admin"]), getActivity);
router.get("/", authMiddleware(["admin"], ["admin"]), getAllActivities);

export default router;
