import express from "express";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";
import { createOrUpdateReview, getMyReviews, deleteReview } from "./review.controllers.js";

const router = express.Router();

router.use(authMiddleware(["user"], ["user"]));

router.post("/", createOrUpdateReview);
router.get("/my-reviews", getMyReviews);
router.delete("/:id", deleteReview);

export default router;
