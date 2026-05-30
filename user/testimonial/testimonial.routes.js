import express from "express";
import {
    createTestimonial,
    getMyTestimonials,
    deleteMyTestimonial,
    getApprovedTestimonialsPublic
} from "./testimonial.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.get("/approved", getApprovedTestimonialsPublic);

router.use(authMiddleware(["user"], ["user"]));

router.post("/", createTestimonial);
router.get("/my-testimonials", getMyTestimonials);
router.delete("/:id", deleteMyTestimonial);

export default router;
