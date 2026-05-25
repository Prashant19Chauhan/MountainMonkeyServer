import { z } from "zod";

export const createStorySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    content: z.string().min(20, "Content must be at least 20 characters"),
    images: z.array(z.string().url()).optional(),
    location: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
});

export const updateStorySchema = z.object({
    title: z.string().min(5).max(100).optional(),
    content: z.string().min(20).optional(),
    images: z.array(z.string().url()).optional(),
    location: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
});

export const adminActionSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().optional(),
});
