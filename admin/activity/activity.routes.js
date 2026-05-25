import express from "express";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivity,
  getAllActivities
} from "./activity.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.post("/", authMiddleware(["admin"], ["admin"]), createActivity);
router.put("/:id", authMiddleware(["admin"], ["admin"]), updateActivity);
router.delete("/:id", authMiddleware(["admin"], ["admin"]), deleteActivity);
router.get("/:id", authMiddleware(["admin"], ["admin"]), getActivity);
router.get("/", authMiddleware(["admin"], ["admin"]), getAllActivities);

export default router;
