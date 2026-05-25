import { z } from "zod";

/* =========================================
   COMMON
========================================= */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const optionalObjectId = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[0-9a-fA-F]{24}$/.test(val),
    "Invalid ObjectId"
  );

/* =========================================
   ENUMS
========================================= */

const foodTypeEnum = z.enum([
  "veg",
  "non-veg",
  "dessert",
  "street"
]);

const placeTypeEnum = z.enum([
  "tourist_spot",
  "hidden_gem",
  "religious",
  "nature",
  "market"
]);

const severityEnum = z.enum([
  "low",
  "medium",
  "high"
]);

/* =========================================
   SUB SCHEMAS
========================================= */

const foodSchema = z.object({

  name: z
    .string()
    .min(2, "Food name required"),

  description: z
    .string()
    .optional(),

  images: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url())
    .default([]),

  typeOfFood: foodTypeEnum,

  bestPlaces: z
    .array(
      z.object({

        name: z
          .string()
          .min(2),

        location: z
          .string()
          .min(2)

      })
    )
    .default([])

});

const placeSchema = z.object({

  name: z
    .string()
    .min(2, "Place name required"),

  description: z
    .string()
    .optional(),

  images: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url())
    .default([]),

  type: placeTypeEnum,

  bestTimeToVisit: z
    .string()
    .optional(),

  entryFee: z
    .number()
    .min(0)
    .default(0),

  timings: z
    .string()
    .optional()

});

const precautionSchema = z.object({

  title: z
    .string()
    .min(2),

  description: z
    .string()
    .min(5),

  severity: severityEnum

});

const phraseSchema = z.object({

  local: z
    .string()
    .min(1),

  english: z
    .string()
    .min(1)

});

const mythSchema = z.object({

  title: z
    .string()
    .min(2),

  story: z
    .string()
    .min(10)

});

/* =========================================
   MAIN SCHEMA
========================================= */

export const createLocalInfoSchema = z.object({

  /* ======================================
     DESTINATION
  ====================================== */

  destinationId: optionalObjectId,

  /* ======================================
     BASIC INFO
  ====================================== */

  language: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
    .default([]),

  currency: z
    .string()
    .default("INR"),

  bestTimeToVisit: z
    .string()
    .optional(),

  /* ======================================
     FOOD
  ====================================== */

  famousFood: z
    .array(foodSchema)
    .default([]),

  /* ======================================
     PLACES
  ====================================== */

  famousPlaces: z
    .array(placeSchema)
    .default([]),

  /* ======================================
     CULTURE
  ====================================== */

  culture: z.object({

    traditions: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    festivals: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    localEtiquette: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([])

  }).default({
    traditions: [],
    festivals: [],
    localEtiquette: []
  }),

  /* ======================================
     MYTHS
  ====================================== */

  mythsAndStories: z
    .array(mythSchema)
    .default([]),

  /* ======================================
     PRECAUTIONS
  ====================================== */

  precautions: z
    .array(precautionSchema)
    .default([]),

  /* ======================================
     SAFETY
  ====================================== */

  safety: z.object({

    overallSafety: z
      .number()
      .min(1)
      .max(10)
      .default(5),

    tips: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    emergencyContacts: z
      .array(
        z.object({

          authority: z
            .string()
            .min(2),

          number: z
            .string()
            .min(3)

        })
      )
      .default([])

  }).default({
    overallSafety: 5,
    tips: [],
    emergencyContacts: []
  }),

  /* ======================================
     CLOTHING
  ====================================== */

  clothing: z.object({

    summer: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    winter: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    religiousPlaces: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    generalTips: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([])

  }).default({
    summer: [],
    winter: [],
    religiousPlaces: [],
    generalTips: []
  }),

  /* ======================================
     DOS & DONTS
  ====================================== */

  dos: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
    .default([]),

  donts: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
    .default([]),

  /* ======================================
     TIPS
  ====================================== */

  localTips: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
    .default([]),

  /* ======================================
     PHRASES
  ====================================== */

  phrases: z
    .array(phraseSchema)
    .default([]),

  /* ======================================
     AI
  ====================================== */

  aiSummary: z
    .string()
    .optional(),

  embedding: z
    .array(z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }))
    .optional(),

  /* ======================================
     METADATA
  ====================================== */

  popularityScore: z
    .number()
    .min(0)
    .max(100)
    .default(0),

  lastUpdated: z
    .date()
    .optional()

});
