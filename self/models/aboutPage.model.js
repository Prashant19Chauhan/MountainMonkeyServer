import mongoose from "mongoose";

const customLinkSchema = new mongoose.Schema({
    text: { type: String, required: true },
    url: { type: String, required: true }
});

const customFaqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const customSectionSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    paragraph: { type: String, required: true },
    images: [String],
    links: [customLinkSchema],
    faq: [customFaqSchema]
});

const aboutPageSectionsSchema = new mongoose.Schema({
    hero: {
        title: { type: String, required: true, default: "About Us" },
        tagline: { type: String, required: true, default: "Learn more about our mystical Himalayan journey." },
        image: { type: String, default: "" }
    },
    customSections: [customSectionSchema]
}, {timestamps: true});

export const AboutPageSections = mongoose.model("AboutPageSections", aboutPageSectionsSchema);
