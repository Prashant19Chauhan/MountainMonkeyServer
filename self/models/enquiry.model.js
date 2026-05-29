import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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
    required: true
  },
  enquiryType: {
    type: String,
    enum: ["stay", "package", "activity", "destination"],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemTitle: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: false
  },
  checkOutDate: {
    type: Date,
    required: false
  },
  numberOfGuests: {
    type: Number,
    required: false
  },
  roomType: {
    type: String,
    required: false
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

export default mongoose.model("Enquiry", enquirySchema);
