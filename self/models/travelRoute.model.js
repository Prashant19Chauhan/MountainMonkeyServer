import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepId: {
    type: String,
    required: true
  },
  from: {
    name: {type: String, required: true},
    location:{
        address: String,
        coordinates: {
            longitude: Number,
            latitude: Number
        },
        mainCity:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Locations"
        }
    }
  },

  to: {
    name: {type: String, required: true},
    location:{
        address: String,
        coordinates: {
            longitude: Number,
            latitude: Number
        },
        mainCity:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Locations"
        }
    }
  },

  travelDetails: {
    mode: String,
    minCost: Number,
    maxCost: Number,
    duration: Number, //minutes
    provider: String,
    distance: Number, //kilometers
    difficultyInTravelling: String,
  },

  previousRoutesTrack:[String],

  isDestinationReached: {
    type: Boolean,
    default: false
  },

  totalMinCost: Number,
  totalMaxCost: Number,
  totalDuration: Number,
  totalDistance: Number,
  totalStops: Number,
  
}, { _id: false });

const smartRouteSchema = new mongoose.Schema({
  routeType: [String],

  totalMinCost: Number,
  totalMaxCost: Number,
  totalDuration: Number,

  modesUsed: [String],

  distance: Number,

  steps: [String],

  stopCount: Number,

  score: {
    costEfficiency: Number,
    timeEfficiency: Number,
    convenience: Number
  },

  aiSummary: String,

  embedding: [Number]
}, { _id: false });


// 🔥 MAIN PARENT SCHEMA
const travelRouteSchema = new mongoose.Schema({

  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true
  },

  adminId: mongoose.Schema.Types.ObjectId,
  
  name: String,
  
  from: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    name: String
  },

  to: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    name: String
  },

  routes: [stepSchema],

  smartRoutes: [smartRouteSchema],

  // 🔥 Metadata for AI + filtering
  stats: {
    cheapestRouteId: String,
    fastestRouteId: String
  },

  // 🔥 Graph optimization
  connectivityScore: Number, // how well connected this route is

  popularityScore: Number, // based on usage

  lastUpdated: Date
}, { timestamps: true });

export default mongoose.model("TravelRoute", travelRouteSchema);