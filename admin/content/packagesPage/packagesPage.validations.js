import { z } from "zod";

export const updatePackagesPageSectionsSchema = z.object({
    customSections: z.array(z.object({
        heading: z.string({
            required_error: "heading is required",
            invalid_type_error: "heading must be a string"
        }).min(1, "heading is required"),
        paragraph: z.string({
            required_error: "paragraph is required",
            invalid_type_error: "paragraph must be a string"
        }).min(1, "paragraph is required"),
        images: z.array(z.string({
            invalid_type_error: "images must be an array of strings"
        })),
        links: z.array(z.object({
            text: z.string({
                required_error: "link text is required"
            }).min(1, "link text is required"),
            url: z.string({
                required_error: "link url is required"
            }).min(1, "link url is required")
        })),
        faq: z.array(z.object({
            question: z.string({
                required_error: "question is required"
            }).min(1, "question is required"),
            answer: z.string({
                required_error: "answer is required"
            }).min(1, "answer is required")
        }))
    }))
});
