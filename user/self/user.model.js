import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ===== AUTH =====
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ===== TRAVEL PROFILE =====
    countriesVisited: {
      type: [String],
      default: [],
    },
    dreamDestination: {
      type: [String],
      default: [],
    },
    travelTypes: {
      type: [String], // array of strings
      default: [],
    },
    frequency: {
      type: String,
      enum: ["rarely", "occasionally", "frequently", "very_frequently"],
      default: "occasionally",
    },
    adventureLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    bio: {
      type: String,
      default: "",
    },

    // ===== PROFILE STATUS =====
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    // ===== EXTRA INFO =====
    phone: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      enum: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean"],
      default: "English",
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },

    // ===== SYSTEM FLAGS =====
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "creator"],
      default: "user",
    },
    mood: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);