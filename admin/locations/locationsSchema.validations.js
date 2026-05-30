import {z} from 'zod';

export const createLocationSchema = z.object({
    name: z.string({
        required_error: "Location name is required",
        invalid_type_error: "Location name must be a string"
    }).min(1, "Location name is required"),
    slug: z.string().optional(),
    country: z.string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string"
    }).min(1, "Country is required"),
    state: z.string({
        required_error: "State is required",
        invalid_type_error: "State must be a string"
    }).min(1, "State is required"),
    city: z.string({
        required_error: "City is required",
        invalid_type_error: "City must be a string"
    }).min(1, "City is required"),
    address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string"
    }).min(1, "Address is required"),
    locationCoordinates: z.object({
        type: z.string().optional(),
        coordinates: z.array(z.number()).optional(),
    }, { required_error: "Coordinates are required", invalid_type_error: "Coordinates must be an object" }),
    altitude: z.number({
        required_error: "Altitude is required",
        invalid_type_error: "Altitude must be a number"
    }),
    timezone: z.string({
        required_error: "Timezone is required",
        invalid_type_error: "Timezone must be a string"
    }),
    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string"
    }),
    status: z.string().optional(),
})

export const deleteLocationSchema = z.string({
    required_error: "Location ID is required",
    invalid_type_error: "Location ID must be a string"
}).min(1, "Location ID is required");

export const updateLocationSchema = z.object({
  name: z.string({ invalid_type_error: "Location name must be a string" }).min(1, "Location name is required").optional(),
  slug: z.string().optional(),
  state: z.string({ invalid_type_error: "State must be a string" }).min(1, "State is required").optional(),
  city: z.string({ invalid_type_error: "City must be a string" }).min(1, "City is required").optional(),
  address: z.string({ invalid_type_error: "Address must be a string" }).min(1, "Address is required").optional(),
  timezone: z.string({ invalid_type_error: "Timezone must be a string" }).optional(),
  description: z.string({ invalid_type_error: "Description must be a string" }).optional(),
  locationCoordinates: z.object({
    type: z.string().optional(),
    coordinates: z.array(z.number()).optional(),
  }).optional(),
  altitude: z.number({ invalid_type_error: "Altitude must be a number" }).optional(),
  status: z.string().optional(),
});