import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  price: Number,
  currency: {
    type: String,
    default: "INR"
  },
  isFree: Boolean
}, { _id: false });

const timingSchema = new mongoose.Schema({
  openingTime: String,
  closingTime: String,
  duration: Number // in minutes
}, { _id: false });

const providerSchema = new mongoose.Schema({
  name: String,
  contact: String,
  website: String
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const activitySchema = new mongoose.Schema({

  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true,
    sparse: true
  },

  name: String,

  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination"
  },

  type: {
    type: String,
  },

  category: [
    "trekking",
    "paragliding",
    "museum",
    "temple",
    "street_food",
    "market"
  ],

  shortDescription: String,
  longDescription: String,

  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },

    mainCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    }
  },

  timing: timingSchema,

  bestTimeToVisit: String, // morning, evening, season

  pricing: pricingSchema,

  difficultyLevel: {
    type: String,
    enum: ["easy", "moderate", "hard"]
  },

  ageLimit: {
    min: Number,
    max: Number
  },

  requiredItems: [String], // shoes, water, etc.

  safetyInfo: {
    precautions: [String],
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"]
    }
  },

  providers: [providerSchema], // local vendors

  ratings: {
    average: Number,
    count: Number
  },

  reviews: [reviewSchema],

  images: [String],

  tags: [
    "budget",
    "luxury",
    "family",
    "couple",
    "solo",
    "adventure",
    "relaxing"
  ],

  // 🔥 AI Optimization Fields
  aiScore: {
    popularity: Number,
    experienceQuality: Number,
    valueForMoney: Number,
    uniqueness: Number
  },

  recommendedFor: [
    "solo",
    "couple",
    "family",
    "friends",
    "adventure_seekers"
  ],

  timeSlotPreference: [
    "morning",
    "afternoon",
    "evening",
    "night"
  ],

  aiSummary: String,

  embedding: [Number],

  popularityScore: Number,

  currentPrice: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);