import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  link: {
    text: { type: String, required: false, default: "" },
    url: { type: String, required: false, default: "" }
  }
});

const faqSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  faqs: [faqItemSchema]
});

const faqPageSectionsSchema = new mongoose.Schema({
  sections: [faqSectionSchema]
}, { timestamps: true });

export const FaqPageSections = mongoose.model("FaqPageSections", faqPageSectionsSchema);
