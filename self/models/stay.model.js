import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  typeOfRoom: String, // Deluxe, Standard, Dorm, Suite

  pricePerNight: {
    min: Number,
    max: Number
  },

  capacity: Number,

  amenities: [String], // AC, WiFi, TV, etc.

  availability: {
    totalRooms: Number,
    availableRooms: Number
  },

  roomImages: [String],

  currentPrice: {
    type: Number,
    default: 0
  }
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


const staySchema = new mongoose.Schema({
  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true,
    sparse: true
  },

  adminId: mongoose.Schema.Types.ObjectId,

  name: String,

  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true
  },

  shortDescription: String,

  longDescription: String,

  type: {
    type: String,
    enum: ["hotel", "hostel", "homestay", "resort", "villa"]
  },

  starRating: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },

  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
  },

  location: {
    address: String,

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

  priceRange: {
    min: Number,
    max: Number
  },

  rooms: [roomSchema],

  amenities: {
    type: [String],
    enum: [
      "wifi", "pool", "parking", "gym", "spa", "restaurant", "bar", "room_service",
      "ac", "tv", "heater", "laundry", "pet_friendly", "wheelchair_accessible",
      "bonfire", "trekking_guide", "kids_play_area", "campfire", "breakfast_included",
      "kitchenette", "balcony", "lake_view", "mountain_view", "garden", "game_room",
      "conference_hall", "doctor_on_call"
    ],
    default: []
  },

  policies: [
    {
      policyName: String,
      policyDescription: String,
    }
  ],

  ratings: {
    average: Number,
    count: Number
  },

  reviews: [reviewSchema],


  connectivity: {
    nearestAirport: String,
    nearestRailway: String,
    nearestBusStop: String,
    popularPlaces: [
      {
        name: String,
        distance: Number
      }
    ]
  },

  safetyMeasuresRatings: {
    emergencyContact: Number,
    firstAid: Number,
    security: Number,
    fireSafety: Number,
    hygiene: Number,
    staffTraining: Number,
    sanitizationProtocols: Number
  },

  cancellationPolicy: [
    {
      policyName: String,
      policyDescription: String,
    }
  ],

  aiMetaData: {
    tags: {
      type: [String],
      enum: [
        "luxury", "mountain_view", "family_friendly", "riverfront", "eco_lodge",
        "heritage", "cozy", "budget", "romantic", "offbeat", "forest_view",
        "lakeview", "backpacker_hub", "boutique", "secluded", "pet_friendly"
      ],
      default: []
    },
    suitableFor: {
      type: [String],
      enum: [
        "couples", "families", "business_travelers", "solo_travelers", "groups",
        "backpackers", "wellness_seekers", "honeymooners", "digital_nomads", "pet_owners"
      ],
      default: []
    },
    stayType: {
      type: [String],
      enum: [
        "boutique", "heritage", "resort", "glamping", "homestay", "hostel",
        "cottage", "villa", "hotel", "camp", "cabin", "treehouse", "guest_house"
      ],
      default: []
    },
  },

  // 🔥 AI specific fields
  aiScore: {
    valueForMoney: Number,
    locationScore: Number,
    cleanliness: Number,
    overall: Number
  },

  embedding: [Number], // semantic search

  popularityScore: Number,

  images: [String],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Stay", staySchema);