import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const AdminAuth = mongoose.model("AdminSession", authSchema)

export default AdminAuth