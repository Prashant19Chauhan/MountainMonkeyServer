import mongoose from "mongoose";

const travelerStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        trim: true,
        default: "",
    },
    content: {
        type: String,
        required: true,
    },
    tripExperience: {
        type: String, // Overall trip experience summary
        default: "",
    },
    storyAboutTrip: {
        type: String, // Detailed personal narrative about the trip
        default: "",
    },
    coverImage: {
        type: String, // Main cover image URL
        default: "",
    },
    images: [{
        type: String, // Additional image URLs
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    location: {
        type: String, // e.g. "Manali, India"
        default: "",
    },
    destination: {
        type: String, // Freetext destination name
        default: "",
    },
    tripDate: {
        type: Date, // When the trip happened
    },
    tripDuration: {
        type: String, // e.g. "5 days 4 nights"
        default: "",
    },
    tags: [{
        type: String, // e.g. ["trekking", "himalaya", "adventure"]
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
    },
    metaData: {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        keywords: { type: String, default: "" },
    }
}, { timestamps: true });

// Index slug for faster lookup
travelerStorySchema.index({ slug: 1 });

const TravelerStory = mongoose.model("TravelerStory", travelerStorySchema);

export default TravelerStory;
