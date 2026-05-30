import mongoose from "mongoose";

const citiesSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true }
});

const citiesPageSectionsSchema = new mongoose.Schema({
  title: { type: String, default: "Available Cities" },
  description: { type: String, default: "Explore our dynamic basecamp operations and curated tour packages operating across major Himalayan cities." },
  sections: [citiesSectionSchema]
}, { timestamps: true });

export const CitiesPageSections = mongoose.model("CitiesPageSections", citiesPageSectionsSchema);
