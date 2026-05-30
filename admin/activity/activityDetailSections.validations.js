import { z } from "zod";

export const updateActivityDetailSectionsSchema = z.object({
    customSections: z.array(z.object({
        heading: z.string({ required_error: "heading is required" }).min(1, "heading is required"),
        paragraph: z.string({ required_error: "paragraph is required" }).min(1, "paragraph is required"),
        images: z.array(z.string()),
        links: z.array(z.object({
            text: z.string({ required_error: "link text is required" }).min(1),
            url: z.string({ required_error: "link url is required" }).min(1)
        })),
        faq: z.array(z.object({
            question: z.string({ required_error: "question is required" }).min(1),
            answer: z.string({ required_error: "answer is required" }).min(1)
        }))
    }))
});
