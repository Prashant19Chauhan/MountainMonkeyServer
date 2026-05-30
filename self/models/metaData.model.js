import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  pageId: {
    type: String,
    required: true
  },
  
  metaTitle: {
    type: String,
    required: true
  },

  metaDescription: {
    type: String,
    required: true
  },

  keywords: [String],

  focusKeyword: String,

  secondaryKeywords: [String],

  canonicalUrl: String,

  robots: {
    index: {
      type: Boolean,
      default: true
    },

    follow: {
      type: Boolean,
      default: true
    },

    noarchive: {
      type: Boolean,
      default: false
    },

    nosnippet: {
      type: Boolean,
      default: false
    },

    noimageindex: {
      type: Boolean,
      default: false
    }
  },

  openGraph: {
    title: String,

    description: String,

    image: String,

    imageAlt: String,

    type: {
      type: String,
      default: "website"
    },

    url: String,

    siteName: String,

    locale: {
      type: String,
      default: "en_US"
    }
  },

  twitter: {
    card: {
      type: String,
      default: "summary_large_image"
    },

    title: String,

    description: String,

    image: String,

    creator: String
  },

  schemaType: String,

  structuredData: mongoose.Schema.Types.Mixed,

  faqSchema: [
    {
      question: String,
      answer: String
    }
  ],

  breadcrumbTitle: String,

  alternateLanguages: [
    {
      language: String,
      url: String
    }
  ],

  ogImageWidth: Number,

  ogImageHeight: Number,

  priority: {
    type: Number,
    default: 0.8
  },

  changeFrequency: {
    type: String,
    default: "weekly"
  },

  lastModified: Date,

  sitemapInclude: {
    type: Boolean,
    default: true
  },

  seoScore: Number
});

export const MetaData = mongoose.model("MetaData", seoSchema);