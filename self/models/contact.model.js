import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: false,
    default: "General Enquiry"
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Completed"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("ContactMessage", contactMessageSchema);
