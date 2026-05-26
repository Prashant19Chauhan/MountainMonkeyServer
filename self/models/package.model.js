import mongoose from "mongoose";

const tourPackageSchema = new mongoose.Schema({

  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true,
    sparse: true
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  // 🆔 Basic Info
  title: {
    type: String,
    required: true
  },

  slug: String, // SEO / URL friendly

  description: {
    type: String,
    required: true
  },

  shortDescription: String,

  // 🌍 Location Info
  destination: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination"
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // ⏳ Duration
  duration: {
    days: Number,
    nights: Number
  },

  // 💰 Pricing
  pricing: {
    basePrice: Number,
    discountedPrice: Number,
    currency: {
      type: String,
      default: "INR"
    },
    perPerson: {
      type: Boolean,
      default: true
    },
    taxesIncluded: Boolean
  },

  // 🏷️ Categories
  categories: [{
    type: String,
    enum: [
      "honeymoon",
      "adventure",
      "family",
      "solo",
      "luxury",
      "budget",
      "spiritual",
      "wildlife"
    ]
  }],

  // 🎯 Activities
  activities: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity"
    },
    priceRangeForPackage: {
      min: Number,
      max: Number
    },
  }],

  // 🏨 Accommodation
  accommodations: [
  {
    stayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stay"
    },

    priceRangeForPackage: {
      min: Number,
      max: Number
    },
  }
  ],
  // 🚗 Transport
  transport: {
    included: Boolean,
    modes: [String] // ["flight", "cab", "bus"]
  },

  // 🍽️ Meals
  meals: {
    included: Boolean,
    plan: [String] // ["breakfast", "dinner"]
  },

  // 📅 Availability
  availability: {
    startDate: Date,
    endDate: Date,
    maxSeats: Number,
    availableSeats: Number
  },

  // 🗺️ Itinerary
  itinerary: [
    {
      day: Number,
      title: String,
      description: String,
    }
  ],

  // 📸 Media
  images: [String],
  videos: [String],

  // ⭐ Ratings & Reviews
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },

  reviews: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],

  // 📋 Inclusions / Exclusions
  inclusions: [String],
  exclusions: [String],

  // 🤖 AI METADATA (🔥 MOST IMPORTANT)
  aiMetadata: {

    tags: [String],  
    // ["romantic", "snow", "nature", "peaceful"]

    mood: [String],  
    // ["relaxing", "adventurous", "spiritual"]

    suitableFor: [String],  
    // ["couple", "family", "friends", "solo"]

    difficultyLevel: {
      type: String,
      enum: ["easy", "moderate", "hard"]
    },

    bestSeason: [String],  
    // ["winter", "summer", "monsoon"]

    highlights: [String],  
    // ["Snowfall", "River rafting", "Scenic views"]

    languagesSupported: [String],

    popularityScore: {
      type: Number,
      default: 0
    },

    // 🔥 VECTOR EMBEDDING
    embedding: {
      type: [Number], // 384 / 768 / 1536 length
      index: "vector" // MongoDB Atlas vector index
    }
  },

  // 👤 Vendor Info
  vendor: {
    vendorId: mongoose.Schema.Types.ObjectId,
    name: String,
    contactEmail: String,
    contactPhone: String
  },

  // 📊 Analytics
  analytics: {
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },

  // ⚙️ System Fields
  status: {
    type: String,
    enum: ["draft", "active", "inactive"],
    default: "draft"
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: Date

});

export default mongoose.model("Package", tourPackageSchema)
