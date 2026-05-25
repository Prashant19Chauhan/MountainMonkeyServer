import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    isFeatured: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
