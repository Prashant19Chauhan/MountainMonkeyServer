import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    type: {
        type: String,
        enum: ["banner", "promo", "popup", "hero"],
        default: "banner",
    },
    placement: {
        type: String,
        required: true, // e.g., "home-banner-1", "home-ai-promo"
        index: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    priority: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
