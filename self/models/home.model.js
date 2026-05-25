import mongoose from "mongoose";


const homeHeroSectionSchema = new mongoose.Schema({
    title: String,
    tagline: String,
    searchBarPrompt: String,
    metaTitle: String,
    metaDescription: String,
    categories: [String],
    mood: { 
        type: String, 
        required: true,
        default: 'default'
    },
}, {timestamps: true})

const homePageSectionsSchema = new mongoose.Schema({
    heroSection: [homeHeroSectionSchema],
}, {timestamps: true})

export const HomePageSections = mongoose.model("HomePageSections", homePageSectionsSchema)
