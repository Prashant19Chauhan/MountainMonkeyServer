import {z} from "zod"


//home hero section schema

export const createAndUpdateHomeHeroSectionSchema = z.object({
    title: z.string({
        required_error: "title is required",
        invalid_type_error: "title must be a string"
    }).min(1, "title is required"),
    tagline: z.string({
        required_error: "tagline is required",
        invalid_type_error: "tagline must be a string"
    }).min(1, "tagline is required"),
    searchBarPrompt: z.string({
        required_error: "searchBarPrompt is required",
        invalid_type_error: "searchBarPrompt must be a string"
    }).min(1, "searchBarPrompt is required"),
    metaTitle: z.string({
        required_error: "metaTitle is required",
        invalid_type_error: "metaTitle must be a string"
    }).min(1, "metaTitle is required"),
    metaDescription: z.string({
        required_error: "metaDescription is required",
        invalid_type_error: "metaDescription must be a string"
    }).min(1, "metaDescription is required"),
    categories: z.array(z.string({
        required_error: "categories is required",
        invalid_type_error: "categories must be an array"
    }).min(1, "category is required")),
    mood: z.string({
        required_error: "mood is required",
        invalid_type_error: "mood must be a string"
    }).min(1, "mood is required"),
})

export const updateHomeCustomSectionsSchema = z.object({
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
})
