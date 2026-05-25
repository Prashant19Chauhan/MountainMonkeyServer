import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["admin", "super_admin"],
        default: "admin"
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lastLogin: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Admin = mongoose.model("Admin", adminSchema)

export default Admin