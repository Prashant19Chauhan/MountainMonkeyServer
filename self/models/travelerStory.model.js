import mongoose from "mongoose";

const travelerStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    images: [{
        type: String, // URLs
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    location: {
        type: String, // e.g. "Manali, India"
    },
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
    }
}, { timestamps: true });

const TravelerStory = mongoose.model("TravelerStory", travelerStorySchema);

export default TravelerStory;
