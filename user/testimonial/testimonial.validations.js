import { z } from "zod";

export const createTestimonialSchema = z.object({
    message: z.string().min(10, "Message must be at least 10 characters").max(500),
    rating: z.number().min(1).max(5).optional(),
});

export const adminTestimonialActionSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    isFeatured: z.boolean().optional(),
});
