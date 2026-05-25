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

  roomImages: [String]
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
    unique: true
  },
  
  adminId: mongoose.Schema.Types.ObjectId,

  name: String,

  shortDescription: String,

  longDescription: String,

  type: {
    type: String,
    enum: ["hotel", "hostel", "homestay", "resort", "villa"]
  },

  starRating:{
    type:Number,
    enum:[1,2,3,4,5]
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

    altitude:Number,
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

  amenities: [String], // pool, parking, wifi, gym

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

  cancellationPolicy:[
    {
      policyName:String,
      policyDescription:String,
    }
  ],

  aiMetaData: {
    tags: [],
    suitableFor: [],
    stayType: [],
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