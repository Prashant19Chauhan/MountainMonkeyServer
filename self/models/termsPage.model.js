import mongoose from "mongoose";

const termsSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true }
});

const termsPageSectionsSchema = new mongoose.Schema({
  sections: [termsSectionSchema]
}, { timestamps: true });

export const TermsPageSections = mongoose.model("TermsPageSections", termsPageSectionsSchema);
