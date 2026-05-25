import { z } from "zod";

/* =========================
   ObjectId Validator
========================= */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

/* =========================
   Travel Details
========================= */

const travelDetailsSchema = z.object({
  mode: z.string({
    required_error: "Travel mode is required"
  }).min(2, "Travel mode is required"),

  minCost: z.number({
    required_error: "Minimum cost is required",
    invalid_type_error: "Minimum cost must be a number"
  }),

  maxCost: z.number({
    required_error: "Maximum cost is required",
    invalid_type_error: "Maximum cost must be a number"
  }),

  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration must be a number"
  }),

  provider: z.string({
    required_error: "Provider is required"
  }),

  distance: z.number({
    required_error: "Distance is required",
    invalid_type_error: "Distance must be a number"
  }),

  difficultyInTravelling: z.string({
    required_error: "Difficulty level is required"
  })
});

/* =========================
   Step Schema
========================= */

const stepSchema = z.object({
  stepId: z.string({
    required_error: "Step ID is required"
  }),

  from: z.object({
    name: z.string({
      required_error: "From location name is required"
    }),

    location: z.object({
      address: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      coordinates: z.object({
        longitude: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).optional(),
        latitude: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).optional()
      }).optional(),

      mainCity: objectId.optional()
    }).optional()
  }),

  to: z.object({
    name: z.string({
      required_error: "To location name is required"
    }),

    location: z.object({
      address: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      coordinates: z.object({
        longitude: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).optional(),
        latitude: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).optional()
      }).optional(),

      mainCity: objectId.optional()
    }).optional()
  }),

  travelDetails: travelDetailsSchema,

  previousRoutesTrack: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),

  isDestinationReached: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).optional(),

  totalMinCost: z.number({
    required_error: "Total minimum cost is required"
  }),

  totalMaxCost: z.number({
    required_error: "Total maximum cost is required"
  }),

  totalDuration: z.number({
    required_error: "Total duration is required"
  }),

  totalDistance: z.number({
    required_error: "Total distance is required"
  }),

  totalStops: z.number({
    required_error: "Total stops is required"
  })
});

/* =========================
   ONLY What You Need
========================= */

export const createTravelRouteSchema = z.object({
  name: z.string({
    required_error: "Name is required"
  }),

  from: z.object({
    id: objectId,
    name: z.string({
      required_error: "From name is required"
    })
  }),

  to: z.object({
    id: objectId,
    name: z.string({
      required_error: "To name is required"
    })
  }),

  StepRoutes: z.array(stepSchema)
    .min(1, "At least one step route is required")
}).strict({
  message: "Extra fields are not allowed"
});