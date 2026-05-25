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
