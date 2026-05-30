import { z } from 'zod';

export const createBlogSchema = z.object({
    title: z.string({
        required_error: "Blog title is required",
        invalid_type_error: "Blog title must be a string"
    }).min(1, "Blog title is required"),
    slug: z.string().optional(),
    author: z.string().optional(),
    shortDescription: z.string({
        required_error: "Short description is required",
        invalid_type_error: "Short description must be a string"
    }).min(1, "Short description is required"),
    coverImage: z.string({
        required_error: "Cover image is required",
        invalid_type_error: "Cover image must be a string"
    }).min(1, "Cover image is required"),
    content: z.string({
        required_error: "Content is required",
        invalid_type_error: "Content must be a string"
    }).min(1, "Content is required"),
    category: z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string"
    }).min(1, "Category is required"),
    tags: z.array(z.string()).optional(),
    status: z.string().optional()
});

export const updateBlogSchema = z.object({
    title: z.string({ invalid_type_error: "Blog title must be a string" }).min(1, "Blog title is required").optional(),
    slug: z.string().optional(),
    author: z.string().optional(),
    shortDescription: z.string({ invalid_type_error: "Short description must be a string" }).min(1, "Short description is required").optional(),
    coverImage: z.string({ invalid_type_error: "Cover image must be a string" }).min(1, "Cover image is required").optional(),
    content: z.string({ invalid_type_error: "Content must be a string" }).min(1, "Content is required").optional(),
    category: z.string({ invalid_type_error: "Category must be a string" }).min(1, "Category is required").optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().optional()
});

export const deleteBlogSchema = z.string({
    required_error: "Blog ID is required",
    invalid_type_error: "Blog ID must be a string"
}).min(1, "Blog ID is required");
