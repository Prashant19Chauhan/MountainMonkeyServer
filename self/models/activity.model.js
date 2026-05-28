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

  category: {
    type: [String],
    enum: [
      "trekking", "paragliding", "museum", "temple", "street_food", "market",
      "hiking", "camping", "wildlife_safari", "river_rafting", "scuba_diving",
      "historical_site", "monument", "heritage_walk", "shopping", "spa_wellness",
      "winery_tour", "cooking_class", "photography", "stargazing", "waterfall_trek",
      "beach_outing", "cultural_show", "bungee_jumping", "ziplining", "rock_climbing",
      "caving", "sightseeing", "food_tour", "nature_walk", "boating", "snow_sports",
      "adventure_park", "theme_park", "cable_car", "snorkeling", "kayaking", "surfing",
      "canyoning", "cycling_tour", "yoga_retreat", "meditation", "art_workshop",
      "historical_palace", "monastery", "botanical_garden"
    ],
    default: []
  },

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

  tags: {
    type: [String],
    enum: [
      "budget", "luxury", "family", "couple", "solo", "adventure", "relaxing",
      "eco_friendly", "cultural", "spiritual", "nature", "wildlife", "foodie",
      "instaworthy", "offbeat", "nightlife", "educational", "pet_friendly",
      "accessible", "seasonal", "thrilling", "scenic", "romantic", "historic",
      "local_experience", "indoor", "outdoor", "guided"
    ],
    default: []
  },

  // 🔥 AI Optimization Fields
  aiScore: {
    popularity: Number,
    experienceQuality: Number,
    valueForMoney: Number,
    uniqueness: Number
  },

  recommendedFor: {
    type: [String],
    enum: [
      "solo", "couple", "family", "friends", "adventure_seekers", "nature_lovers",
      "history_buffs", "foodies", "senior_citizens", "backpackers", "wellness_seekers",
      "corporate_groups", "photographers", "families_with_kids", "student_groups",
      "pet_owners", "thrill_seekers"
    ],
    default: []
  },

  timeSlotPreference: {
    type: [String],
    enum: [
      "early_morning", "morning", "afternoon", "evening", "night", "overnight"
    ],
    default: []
  },

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