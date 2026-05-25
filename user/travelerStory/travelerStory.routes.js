import express from "express";
import {
    createStory,
    getMyStories,
    updateStory,
    deleteStory
} from "./travelerStory.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.use(authMiddleware(["user"], ["user"]));

router.post("/", createStory);
router.get("/my-stories", getMyStories);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);

export default router;
