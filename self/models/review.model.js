import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    itemType: {
        type: String,
        enum: ["package", "destination", "activity", "stay"],
        required: true,
    },
    itemTitle: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewText: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, { timestamps: true });

// Unique compound index: one review per user per item
reviewSchema.index({ userId: 1, itemId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
