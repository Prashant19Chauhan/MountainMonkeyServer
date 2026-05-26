import { z } from "zod";
import mongoose from "mongoose";

/* =====================================================
   Common Validators
===================================================== */

// ObjectId Validator
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Positive Number Helper
const positiveNumber = z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).nonnegative();

/* =====================================================
   Destination Schema
===================================================== */

const destinationSchema = z.object({
  id: objectId,
  coordinates: z.object({
    lat: z.number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    }),
    lng: z.number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    }),
  }),
});

/* =====================================================
   Pricing Schema
===================================================== */

const pricingSchema = z.object({
  basePrice: positiveNumber,
  discountedPrice: positiveNumber.optional(),
  currency: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(1, "Currency is required"),
  perPerson: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }),
  taxesIncluded: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }),
}).refine(
  (data) => !data.discountedPrice || data.discountedPrice <= data.basePrice,
  {
    message: "Discounted price must be less than or equal to base price",
  }
);

/* =====================================================
   Vendor Schema
===================================================== */

const vendorSchema = z.object({
  vendorId: objectId,
  name: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(2, "Vendor name required"),
  contactEmail: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).email("Invalid email format"),
  contactPhone: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(5, "Contact phone required"),
});

/* =====================================================
   Main Package Schema
===================================================== */

export const createPackageSchema = z.object({
  /* 🆔 Basic Info */
  title: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(3, "Title must be at least 3 characters"),
  slug: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),
  description: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(10, "Description must be at least 10 characters"),
  shortDescription: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(5, "Short description required"),

  /* 🌍 Destination */
  destination: destinationSchema,

  /* ⏳ Duration */
  duration: z.object({
    days: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).int().positive(),
    nights: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).int().nonnegative(),
  }).refine((data) => data.nights === data.days - 1, {
    message: "Nights should be days - 1",
  }),

  /* 💰 Pricing */
  pricing: pricingSchema,

  /* 🏷️ Categories */
  categories: z.array(
    z.enum([
      "honeymoon",
      "adventure",
      "family",
      "solo",
      "luxury",
      "budget",
      "spiritual",
      "wildlife",
    ])
  ).min(1, "At least one category required"),

  /* 🎯 Activities */
  activities: z.array(
    z.object({
      id: objectId,
      priceRangeForPackage: z.object({
        min: positiveNumber,
        max: positiveNumber,
      }).refine((data) => data.min <= data.max, {
        message: "Min price must be <= max price",
      }),
    })
  ).optional(),

  /* 🏨 Accommodations */
  accommodations: z.array(
    z.object({
      stayId: objectId,
      priceRangeForPackage: z.object({
        min: positiveNumber,
        max: positiveNumber,
      }).refine((data) => data.min <= data.max, {
        message: "Min price must be <= max price",
      }),
    })
  ).optional(),

  /* 🚗 Transport */
  transport: z.object({
    included: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }),
    modes: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(1)).min(1, "At least one transport mode required"),
  }),

  /* 🍽️ Meals */
  meals: z.object({
    included: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }),
    plan: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(1)).optional(),
  }),

  /* 📅 Availability */
  availability: z.object({
    startDate: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date().optional()
    ),
    endDate: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date().optional()
    ),
    maxSeats: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).int().positive().optional(),
    availableSeats: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).int().nonnegative().optional(),
  }).optional(),

  /* 🗺️ Itinerary */
  itinerary: z.array(
    z.object({
      day: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).int().positive(),
      title: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(3),
      description: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(5),
    })
  ).min(1, "Itinerary required"),

  /* 📸 Media */
  images: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url()).optional(),
  videos: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url()).optional(),

  /* 📋 Inclusions / Exclusions */
  inclusions: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(1)).min(1, "At least one inclusion required"),
  exclusions: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(1)).optional(),

  /* 🤖 AI Metadata */
  aiMetadata: z.object({
    tags: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),
    mood: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),
    suitableFor: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),
    difficultyLevel: z.enum(["easy", "moderate", "hard"]),
    bestSeason: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),
    highlights: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),
    languagesSupported: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),
    popularityScore: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).min(0).max(100).default(0),
  }),

  /* 👤 Vendor */
  vendor: vendorSchema,

  /* ⚙️ System Fields */
  status: z.enum(["draft", "active", "inactive"]).default("draft"),
  isFeatured: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(false),
  currentPrice: z.number().min(0, "Current price cannot be negative").default(0).optional(),

}).strict();