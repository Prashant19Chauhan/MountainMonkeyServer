import mongoose from "mongoose";

const privacySectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true }
});

const privacyPageSectionsSchema = new mongoose.Schema({
  sections: [privacySectionSchema]
}, { timestamps: true });

export const PrivacyPageSections = mongoose.model("PrivacyPageSections", privacyPageSectionsSchema);
