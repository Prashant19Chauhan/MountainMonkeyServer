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

const cityDetailSectionsSchema = new mongoose.Schema({
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
        unique: true,
        index: true
    },
    customSections: [customSectionSchema],
}, { timestamps: true });

export const CityDetailSections = mongoose.model("CityDetailSections", cityDetailSectionsSchema);
