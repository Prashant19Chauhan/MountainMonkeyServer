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
  },

  categories: [String], // ["romantic", "adventure", "family", "budget"]

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
      type: [String]
    },

    mood: {
      type: [String]
    },

    suitableFor: {
      type: [String]
    },

    travelStyle: {
      type: [String]
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