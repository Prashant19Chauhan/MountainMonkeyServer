import mongoose from "mongoose";
import { generateSlug } from "../utility/slug.utils.js";

const locationSchema = new mongoose.Schema({

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
  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true
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

// Auto-generate slug on save
locationSchema.pre("save", function(next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// 🔥 IMPORTANT (enables geospatial queries)
locationSchema.index({
  locationCoordinates: "2dsphere",
});

export const Location = mongoose.model("Location", locationSchema);