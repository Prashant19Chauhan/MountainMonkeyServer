import { z } from "zod";

/* =========================================
   COMMON
========================================= */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const optionalObjectId = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^[0-9a-fA-F]{24}$/.test(val),
    "Invalid ObjectId format"
  );

/* =========================================
   ENUMS
========================================= */

const categoryEnum = z.enum([
  "trekking", "paragliding", "museum", "temple", "street_food", "market",
  "hiking", "camping", "wildlife_safari", "river_rafting", "scuba_diving",
  "historical_site", "monument", "heritage_walk", "shopping", "spa_wellness",
  "winery_tour", "cooking_class", "photography", "stargazing", "waterfall_trek",
  "beach_outing", "cultural_show", "bungee_jumping", "ziplining", "rock_climbing",
  "caving", "sightseeing", "food_tour", "nature_walk", "boating", "snow_sports",
  "adventure_park", "theme_park", "cable_car", "snorkeling", "kayaking", "surfing",
  "canyoning", "cycling_tour", "yoga_retreat", "meditation", "art_workshop",
  "historical_palace", "monastery", "botanical_garden"
]);

const difficultyEnum = z.enum([
  "easy",
  "moderate",
  "hard"
]);

const riskLevelEnum = z.enum([
  "low",
  "medium",
  "high"
]);

const tagsEnum = z.enum([
  "budget", "luxury", "family", "couple", "solo", "adventure", "relaxing",
  "eco_friendly", "cultural", "spiritual", "nature", "wildlife", "foodie",
  "instaworthy", "offbeat", "nightlife", "educational", "pet_friendly",
  "accessible", "seasonal", "thrilling", "scenic", "romantic", "historic",
  "local_experience", "indoor", "outdoor", "guided"
]);

const recommendedForEnum = z.enum([
  "solo", "couple", "family", "friends", "adventure_seekers", "nature_lovers",
  "history_buffs", "foodies", "senior_citizens", "backpackers", "wellness_seekers",
  "corporate_groups", "photographers", "families_with_kids", "student_groups",
  "pet_owners", "thrill_seekers"
]);

const timeSlotEnum = z.enum([
  "early_morning", "morning", "afternoon", "evening", "night", "overnight"
]);

/* =========================================
   NESTED SCHEMAS
========================================= */

const pricingSchema = z.object({
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .default(0),

  currency: z
    .string()
    .default("INR"),

  isFree: z
    .boolean()
    .default(false)
})
  .refine((data) => {
    if (data.isFree) {
      return data.price === 0;
    }

    return true;
  }, {
    message: "Free activities must have price 0",
    path: ["price"]
  });

const timingSchema = z.object({
  openingTime: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  closingTime: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  duration: z
    .number()
    .min(0, "Duration cannot be negative")
    .optional()
});

const providerSchema = z.object({
  name: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).min(2).optional(),

  contact: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  website: z
    .union([
      z.literal(""),
      z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url("Invalid website URL")
    ])
    .optional()
});

const reviewSchema = z.object({
  userId: objectId,

  rating: z
    .number()
    .min(1)
    .max(5),

  comment: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional()
});

/* =========================================
   MAIN SCHEMA
========================================= */

export const activityValidationSchema = z.object({

  /* ======================================
     BASIC INFO
  ====================================== */

  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .trim(),

  destinationId: optionalObjectId,

  type: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  category: z
    .array(categoryEnum)
    .default([]),

  shortDescription: z
    .string()
    .min(10, "Short description too short"),

  longDescription: z
    .string()
    .min(20, "Long description too short"),

  /* ======================================
     LOCATION
  ====================================== */

  location: z.object({

    address: z
      .string()
      .min(3, "Address is required"),

    coordinates: z.object({

      lat: z
        .number()
        .min(-90)
        .max(90),

      lng: z
        .number()
        .min(-180)
        .max(180)

    }),

    mainCity: optionalObjectId
  }),

  /* ======================================
     TIMING
  ====================================== */

  timing: timingSchema,

  bestTimeToVisit: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  /* ======================================
     PRICING
  ====================================== */

  pricing: pricingSchema,

  /* ======================================
     ACTIVITY DETAILS
  ====================================== */

  difficultyLevel: difficultyEnum.default("moderate"),

  ageLimit: z.object({

    min: z
      .number()
      .min(0)
      .default(0),

    max: z
      .number()
      .max(120)
      .default(100)

  }).refine((data) => data.max >= data.min, {
    message: "Max age must be greater than min age",
    path: ["max"]
  }),

  requiredItems: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
    .default([]),

  /* ======================================
     SAFETY
  ====================================== */

  safetyInfo: z.object({

    precautions: z
      .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }))
      .default([]),

    riskLevel: riskLevelEnum.default("low")

  }),

  /* ======================================
     PROVIDERS
  ====================================== */

  providers: z
    .array(providerSchema)
    .default([]),

  /* ======================================
     RATINGS
  ====================================== */

  ratings: z.object({

    average: z
      .number()
      .min(0)
      .max(5)
      .default(0),

    count: z
      .number()
      .min(0)
      .default(0)

  }).optional(),

  reviews: z
    .array(reviewSchema)
    .optional(),

  /* ======================================
     MEDIA
  ====================================== */

  images: z
    .array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url())
    .default([]),

  /* ======================================
     TAGS
  ====================================== */

  tags: z
    .array(tagsEnum)
    .default([]),

  recommendedFor: z
    .array(recommendedForEnum)
    .default([]),

  timeSlotPreference: z
    .array(timeSlotEnum)
    .default([]),

  /* ======================================
     AI
  ====================================== */

  aiScore: z.object({

    popularity: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).min(0).max(100).default(0),

    experienceQuality: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).min(0).max(100).default(0),

    valueForMoney: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).min(0).max(100).default(0),

    uniqueness: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).min(0).max(100).default(0)

  }).optional(),

  aiSummary: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  embedding: z
    .array(z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }))
    .optional(),

  popularityScore: z
    .number()
    .min(0)
    .max(100)
    .default(0),

  /* ======================================
     STATUS
  ====================================== */

  isActive: z
    .boolean()
    .default(true),

  currentPrice: z
    .number()
    .min(0, "Current price cannot be negative")
    .default(0)
    .optional()

});