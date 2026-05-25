import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({

  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true
  },

  name: {
    type: String,
    required: true
  },
  country: String,
  state: String,
  city: String,
  address: String,
  timezone: String,
  description: String,
  locationCoordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },
  altitude: Number,
  status: {
    type: String,
    enum: ["Active", "Draft", "Inactive"],
    default: "Active",
  }
});

// 🔥 IMPORTANT (enables geospatial queries)
locationSchema.index({
  locationCoordinates: "2dsphere",
});

export const Location = mongoose.model("Location", locationSchema);