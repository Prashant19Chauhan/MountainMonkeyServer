import { z } from "zod";

export const staySchemaValidation = z.object({

  // ==========================================
  // BASIC INFO
  // ==========================================

  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters long"
    }),

  shortDescription: z
    .string()
    .min(10, {
      message: "Short description must be at least 10 characters long"
    }),

  longDescription: z
    .string()
    .min(10, {
      message: "Long description must be at least 10 characters long"
    }),

  starRating: z
    .number()
    .min(1, {
      message: "Star rating must be at least 1"
    })
    .max(5, {
      message: "Star rating must be at most 5"
    }),

  type: z.enum(
    ["hotel", "hostel", "homestay", "resort", "villa"],
    {
      message:
        "Type must be hotel, hostel, homestay, resort, or villa"
    }
  ),

  // ==========================================
  // RELATIONS
  // ==========================================

  destinationId: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message:
        "Destination must be at least 3 characters long"
    }),

  mainCity: z
    .string()
    .min(3, {
      message:
        "Main city must be at least 3 characters long"
    }),

  // ==========================================
  // LOCATION
  // ==========================================

  location: z.object({
    address: z
      .string()
      .min(3, {
        message:
          "Address must be at least 3 characters long"
      }),

    coordinates: z.object({
      lat: z
        .number({
          message: "Latitude must be a number"
        })
        .min(-90, {
          message: "Latitude must be greater than -90"
        })
        .max(90, {
          message: "Latitude must be less than 90"
        }),

      lng: z
        .number({
          message: "Longitude must be a number"
        })
        .min(-180, {
          message: "Longitude must be greater than -180"
        })
        .max(180, {
          message: "Longitude must be less than 180"
        })
    }),

    altitude: z
      .number()
      .min(0, {
        message: "Altitude cannot be negative"
      })
  }),

  // ==========================================
  // PRICE RANGE
  // ==========================================

  priceRange: z.object({
    min: z
      .number({
        message: "Minimum price must be a number"
      })
      .min(0, {
        message: "Minimum price cannot be negative"
      }),

    max: z
      .number({
        message: "Maximum price must be a number"
      })
      .min(0, {
        message: "Maximum price cannot be negative"
      })
  })
    .refine((data) => data.max >= data.min, {
      message:
        "Maximum price must be greater than minimum price",
      path: ["max"]
    }),

  // ==========================================
  // ROOMS
  // ==========================================

  rooms: z
    .array(
      z.object({
        typeOfRoom: z
          .string({
            message: "Room type is required"
          })
          .min(2, {
            message:
              "Room type must be at least 2 characters long"
          }),

        pricePerNight: z.object({
          min: z
            .number()
            .min(0, {
              message:
                "Minimum room price cannot be negative"
            }),

          max: z
            .number()
            .min(0, {
              message:
                "Maximum room price cannot be negative"
            })
        })
          .refine((data) => data.max >= data.min, {
            message:
              "Maximum room price must be greater than minimum room price",
            path: ["max"]
          }),

        capacity: z
          .number({
            message: "Capacity must be a number"
          })
          .min(1, {
            message:
              "Room capacity must be at least 1"
          }),

        amenities: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })),

        availability: z.object({
          totalRooms: z
            .number()
            .min(0, {
              message:
                "Total rooms cannot be negative"
            }),

          availableRooms: z
            .number()
            .min(0, {
              message:
                "Available rooms cannot be negative"
            })
        })
          .refine(
            (data) =>
              data.availableRooms <= data.totalRooms,
            {
              message:
                "Available rooms cannot exceed total rooms",
              path: ["availableRooms"]
            }
          ),

        roomImages: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url()).optional(),

        currentPrice: z.number().min(0, "Current room price cannot be negative").default(0).optional()
      })
    )
    .min(1, {
      message: "At least one room is required"
    }),

  // ==========================================
  // AMENITIES
  // ==========================================

  amenities: z.array(z.enum([
    "wifi", "pool", "parking", "gym", "spa", "restaurant", "bar", "room_service",
    "ac", "tv", "heater", "laundry", "pet_friendly", "wheelchair_accessible",
    "bonfire", "trekking_guide", "kids_play_area", "campfire", "breakfast_included",
    "kitchenette", "balcony", "lake_view", "mountain_view", "garden", "game_room",
    "conference_hall", "doctor_on_call"
  ])),

  // ==========================================
  // POLICIES
  // ==========================================

  policies: z.array(
    z.object({
      policyName: z
        .string()
        .min(3, {
          message:
            "Policy name must be at least 3 characters long"
        }),

      policyDescription: z
        .string()
        .min(10, {
          message:
            "Policy description must be at least 10 characters long"
        })
    })
  ),

  // ==========================================
  // CONNECTIVITY
  // ==========================================

  connectivity: z.object({
    nearestAirport: z
      .string()
      .min(3, {
        message:
          "Nearest airport must be at least 3 characters long"
      }),

    nearestRailway: z
      .string()
      .min(3, {
        message:
          "Nearest railway must be at least 3 characters long"
      }),

    nearestBusStop: z
      .string()
      .min(3, {
        message:
          "Nearest bus stop must be at least 3 characters long"
      }),

    popularPlaces: z.array(
      z.object({
        name: z
          .string()
          .min(3, {
            message:
              "Place name must be at least 3 characters long"
          }),

        distance: z
          .number()
          .min(0, {
            message:
              "Distance cannot be negative"
          })
      })
    )
  }),

  // ==========================================
  // SAFETY RATINGS
  // ==========================================

  safetyMeasuresRatings: z.object({
    emergencyContact: z
      .number()
      .min(1)
      .max(5),

    firstAid: z
      .number()
      .min(1)
      .max(5),

    security: z
      .number()
      .min(1)
      .max(5),

    fireSafety: z
      .number()
      .min(1)
      .max(5),

    hygiene: z
      .number()
      .min(1)
      .max(5),

    staffTraining: z
      .number()
      .min(1)
      .max(5),

    sanitizationProtocols: z
      .number()
      .min(1)
      .max(5)
  }),

  // ==========================================
  // CANCELLATION POLICY
  // ==========================================

  cancellationPolicy: z.array(
    z.object({
      policyName: z
        .string()
        .min(3, {
          message:
            "Policy name must be at least 3 characters long"
        }),

      policyDescription: z
        .string()
        .min(10, {
          message:
            "Policy description must be at least 10 characters long"
        })
    })
  ),

  // ==========================================
  // AI META DATA
  // ==========================================

  aiMetaData: z.object({
    tags: z.array(z.enum([
      "luxury", "mountain_view", "family_friendly", "riverfront", "eco_lodge",
      "heritage", "cozy", "budget", "romantic", "offbeat", "forest_view",
      "lakeview", "backpacker_hub", "boutique", "secluded", "pet_friendly"
    ])),

    suitableFor: z.array(z.enum([
      "couples", "families", "business_travelers", "solo_travelers", "groups",
      "backpackers", "wellness_seekers", "honeymooners", "digital_nomads", "pet_owners"
    ])),

    stayType: z.array(z.enum([
      "boutique", "heritage", "resort", "glamping", "homestay", "hostel",
      "cottage", "villa", "hotel", "camp", "cabin", "treehouse", "guest_house"
    ]))
  }),

  // ==========================================
  // AI SCORES
  // ==========================================

  aiScore: z.object({
    valueForMoney: z
      .number()
      .min(0)
      .max(100),

    locationScore: z
      .number()
      .min(0)
      .max(100),

    cleanliness: z
      .number()
      .min(0)
      .max(100),

    overall: z
      .number()
      .min(0)
      .max(100)
  }),

  // ==========================================
  // POPULARITY SCORE
  // ==========================================

  popularityScore: z
    .number()
    .min(0)
    .max(100),

  // ==========================================
  // IMAGES
  // ==========================================

  images: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url()).optional(),

  isActive: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).optional()
});