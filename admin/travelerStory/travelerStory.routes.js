import express from "express";
import {
    getAllStories,
    updateStoryStatus,
    deleteStoryAdmin,
    checkSlugAvailability
} from "./travelerStory.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.use(authMiddleware(["admin"], ["admin"]));

router.get("/", getAllStories);
router.get("/check-slug", checkSlugAvailability);
router.put("/:id/status", updateStoryStatus);
router.delete("/:id", deleteStoryAdmin);

export default router;
