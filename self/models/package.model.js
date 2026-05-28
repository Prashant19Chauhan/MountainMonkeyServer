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

  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true // allow existing docs without slug
  }, // SEO / URL friendly

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
      "honeymoon", "adventure", "family", "solo", "luxury", "budget", "spiritual",
      "wildlife", "wellness", "roadtrip", "trekking", "beach", "cultural",
      "weekend_getaway", "nature", "backpacking", "eco_tourism", "festival",
      "photography", "cruise", "winter_special", "summer_special", "monsoon_special"
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
    modes: {
      type: [String],
      enum: ["flight", "cab", "bus", "train", "ferry", "walk", "jeep", "motorbike", "bicycle", "shuttle", "cruiser"],
      default: []
    }
  },

  // 🍽️ Meals
  meals: {
    included: Boolean,
    plan: {
      type: [String],
      enum: ["breakfast", "lunch", "dinner", "all_inclusive", "self_catering", "half_board", "full_board", "tea_snacks"],
      default: []
    }
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

    tags: {
      type: [String],
      enum: [
        "snow", "nature", "romantic", "peaceful", "trekking", "heritage",
        "photography", "camping", "boating", "high_altitude", "offbeat", "luxury",
        "backpacker", "wildlife", "street_food", "shopping", "adventure", "cultural"
      ],
      default: []
    },

    mood: {
      type: [String],
      enum: [
        "relaxing", "adventurous", "spiritual", "thrilling", "romantic", "educational",
        "rejuvenating", "peaceful", "vibrant", "mystical"
      ],
      default: []
    },

    suitableFor: {
      type: [String],
      enum: [
        "couple", "family", "friends", "solo", "kids", "seniors", "corporate",
        "students", "nature_lovers", "backpackers"
      ],
      default: []
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "moderate", "hard"]
    },

    bestSeason: {
      type: [String],
      enum: [
        "winter", "summer", "monsoon", "spring", "autumn", "all_year", "shoulder_season"
      ],
      default: []
    },

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

  currentPrice: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: Date

});

export default mongoose.model("Package", tourPackageSchema)
