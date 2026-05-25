import express from "express";
import {
    getAllTestimonials,
    updateTestimonialStatus,
    deleteTestimonialAdmin
} from "./testimonial.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.use(authMiddleware(["admin"], ["admin"]));

router.get("/", getAllTestimonials);
router.put("/:id/status", updateTestimonialStatus);
router.delete("/:id", deleteTestimonialAdmin);

export default router;
