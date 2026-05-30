import { z } from "zod";

export const createStorySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(200),
    shortDescription: z.string().max(300).optional(),
    content: z.string().min(20, "Content must be at least 20 characters"),
    tripExperience: z.string().optional(),
    storyAboutTrip: z.string().optional(),
    coverImage: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")),
    images: z.array(z.string().url()).optional(),
    location: z.string().optional(),
    destination: z.string().optional(),
    tripDate: z.string().optional(), // ISO date string
    tripDuration: z.string().optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(1).max(5).optional(),
});

export const updateStorySchema = z.object({
    title: z.string().min(5).max(200).optional(),
    shortDescription: z.string().max(300).optional(),
    content: z.string().min(20).optional(),
    tripExperience: z.string().optional(),
    storyAboutTrip: z.string().optional(),
    coverImage: z.string().url().optional().or(z.literal("")),
    images: z.array(z.string().url()).optional(),
    location: z.string().optional(),
    destination: z.string().optional(),
    tripDate: z.string().optional(),
    tripDuration: z.string().optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(1).max(5).optional(),
});

export const adminActionSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().optional(),
    slug: z.string().min(1, "Slug is required").optional(),
    metaData: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.string().optional(),
    }).optional(),
});

