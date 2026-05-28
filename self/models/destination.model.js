import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({

  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true,
    sparse: true
  },

  name: {
    type: String,
    required: true
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  slug: {
    type: String,
    unique: true,
    index: true,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },

  location: {
    address: String,
    pinCode: String,

    coordinates: {
      lat: Number,
      lng: Number
    },

    altitude: Number,
  },

  mainCity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },

  placeType: {
    type: String,
    enum: [
      "City", "Town", "Village", "National Park", "Historical Site", "Beach",
      "Mountain Peak", "Valley"
    ]
  },

  categories: {
    type: [String],
    enum: [
      "Adventure", "Pilgrimage", "Nature", "Luxury", "Trekking", "Honeymoon",
      "Historical", "Beach", "Offbeat", "Wildlife", "Cultural", "Spiritual",
      "Wellness", "Foodie", "Road_Trip", "Weekend_Getaway", "Hill_Station",
      "Desert", "Rural", "Urban", "Backpacking", "Heritage", "Snow_Destination",
      "Riverside"
    ],
    default: []
  },

  nearbyDestinations: [
    {
      destinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination"
      },
      distance: Number,
      travelTime: Number,
      routeType: String // road/train/flight
    }
  ],

  budgetEstimate: {
    dailyAvg: Number,
    budget: Number,
    luxury: Number
  },

  images: [String],
  videos: [String],

  ratings: {
    average: Number,
    count: Number
  },

  aiMetadata: {

    tags: {
      type: [String],
      enum: [
        "Alpine", "Tropical", "Urban", "Desert", "Ancient", "Spiritual", "Forest",
        "Snowy", "Coastal", "Rural", "Volcanic", "High_Altitude", "Lush_Green",
        "Valley", "Riverside", "Lake", "Historical_Hub", "Wildlife_Sanctuary"
      ],
      default: []
    },

    mood: {
      type: [String],
      enum: [
        "Relaxing", "Adventure", "Soulful", "Nature", "Luxury", "Vibrant",
        "Ethereal", "Mystical", "Peaceful", "Romantic", "Cosmopolitan", "Tranquil",
        "Exciting", "Charming", "Rejuvenating"
      ],
      default: []
    },

    suitableFor: {
      type: [String],
      enum: [
        "Solo", "Couples", "Families", "Groups", "Digital Nomads", "Backpackers",
        "Seniors", "Adventure Seekers", "Nature Lovers", "History Buffs", "Wellness Seekers"
      ],
      default: []
    },

    travelStyle: {
      type: [String],
      enum: [
        "Backpacking", "Fast-paced", "Slow Travel", "Eco-focus", "Luxury",
        "Road Trip", "Cultural Immersion", "Adventure", "Wellness", "Bleisure",
        "Weekend Escapes"
      ],
      default: []
    },

    highlights: [
      {
        title: String,
        description: String
      }
    ],

    embedding: {
      type: [Number]
    }
  },

  // 🔄 Graph Weight (for recommendation)
  connectionStrength: [
    {
      destinationId: mongoose.Schema.Types.ObjectId,
      score: Number
    }
  ],

  analytics: {
    searches: Number,
    clicks: Number,
    bookings: Number
  },

  status: {
    type: String,
    enum: ["Active", "Inactive", "Draft"],
    default: "Active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: Date

});

export default mongoose.model("Destination", destinationSchema);