import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [ String ],
  typeOfFood: String, //veg, non-veg, dessert, street
  bestPlaces: [
    {
      name: String,
      location: String
    }
  ]
}, { _id: false });

const placeSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  type: String, //"tourist_spot", "hidden_gem", "religious", "nature", "market"
  bestTimeToVisit: String,
  entryFee: Number,
  timings: String
}, { _id: false });

const precautionSchema = new mongoose.Schema({
  title: String,
  description: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high"]
  }
}, { _id: false });

const localInfoSchema = new mongoose.Schema({

  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true
  },

  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination"
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  // 🌍 Basic Info
  language: [String], // Hindi, English, Local dialect
  currency: String,
  bestTimeToVisit: String,

  // 🍲 Famous Food
  famousFood: [foodSchema],

  // 📍 Famous & Hidden Places
  famousPlaces: [placeSchema],

  // 🧠 Cultural & Mythological Info
  culture: {
    traditions: [String],
    festivals: [String],
    localEtiquette: [String]
  },

  mythsAndStories: [
    {
      title: String,
      story: String
    }
  ],

  // ⚠️ Precautions & Safety
  precautions: [precautionSchema],

  safety: {
    overallSafety: Number, // 1-10
    tips: [String],
    emergencyContacts: [
      {
        authority: String, // police, hospital
        number: String
      }
    ]
  },

  // 👕 What to Wear
  clothing: {
    summer: [String],
    winter: [String],
    religiousPlaces: [String],
    generalTips: [String]
  },

  // ✅ Do’s & ❌ Don’ts
  dos: [String],
  donts: [String],

  // 🧳 Travel Tips
  localTips: [String],

  // 🗣️ Useful Phrases
  phrases: [
    {
      local: String,
      english: String
    }
  ],

  // 🔥 AI Fields
  aiSummary: String,
  embedding: [Number],

  // 📊 Metadata
  popularityScore: Number,
  lastUpdated: Date

}, { timestamps: true });


export default mongoose.model("LocalInfo", localInfoSchema);