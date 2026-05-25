import {z} from "zod";

const optionalObjectId = z.string({ invalid_type_error: "Object ID must be a string" }).refine((val) => {try {new mongoose.Types.ObjectId(val); return true;} catch (e) {return false;}}, "Invalid Object ID").optional();

export const createDestinationSchema = z.object({
    name: z.string({ required_error: "Destination name is required", invalid_type_error: "Destination name must be a string" }).min(1, "Please provide destination name"),
    description: z.string({ required_error: "Description is required", invalid_type_error: "Description must be a string" }).min(10, "Please provide destination description"),
    shortDescription: z.string({ required_error: "Short description is required", invalid_type_error: "Short description must be a string" }).min(5, "Please provide destination short description"),
    location: z.object({
        address: z.string({ required_error: "Address is required", invalid_type_error: "Address must be a string" }).min(1, "Please provide address"),
        pinCode: z.string({ required_error: "Pin code is required", invalid_type_error: "Pin code must be a string" }).min(6, "Please provide pin code"),
        coordinates: z.object({
            lat: z.number({ required_error: "Latitude is required", invalid_type_error: "Latitude must be a number" }),
            lng: z.number({ required_error: "Longitude is required", invalid_type_error: "Longitude must be a number" })
        }, { required_error: "Coordinates are required" }),
        altitude: z.number({ required_error: "Altitude is required", invalid_type_error: "Altitude must be a number" })
    }, { required_error: "Location is required" }),
    mainCity: z.string({ required_error: "Main city ID is required", invalid_type_error: "Main city ID must be a string" }).min(1, "Please provide main city id"),
    placeType: z.string({ required_error: "Place type is required", invalid_type_error: "Place type must be a string" }).min(1, "Please provide place type"),
    categories: z.array(z.string({ invalid_type_error: "Category must be a string" }), { required_error: "Categories are required", invalid_type_error: "Categories must be an array" }).min(1, "Please provide at least one category"),
    nearbyDestinations: z.array(z.object({
        destinationId: z.string({ required_error: "Destination ID is required" }).min(1, "Please provide destination id"),
        distance: z.number({ required_error: "Distance is required" }).positive(),
        travelTime: z.number({ required_error: "Travel time is required" }).positive(),
        routeType: z.string({ required_error: "Route type is required" }).min(1, "Please provide route type")
    })).optional(),
    budgetEstimate: z.object({
        dailyAvg: z.number({ required_error: "Daily average is required" }).positive(),
        budget: z.number({ required_error: "Budget is required" }).positive(),
        luxury: z.number({ required_error: "Luxury is required" }).positive()
    }).optional(),
    images: z.array(z.string({ invalid_type_error: "Image URL must be a string" }).url()).optional(),
    videos: z.array(z.string({ invalid_type_error: "Video URL must be a string" }).url()).optional(),
    aiMetadata: z.object({
        tags: z.array(z.string()).min(1, "Please provide at least one tag"),
        mood: z.array(z.string()).min(1, "Please provide at least one mood"),
        suitableFor: z.array(z.string()).min(1, "Please provide at least one suitable for"),
        travelStyle: z.array(z.string()).min(1, "Please provide at least one travel style"),
        highlights: z.array(z.object({
            title: z.string({ required_error: "Highlight title is required" }).min(1, "Please provide highlight title"),
            description: z.string({ required_error: "Highlight description is required" }).min(1, "Please provide highlight description")
        })),
        embedding: z.array(z.number()).optional()
    }, { required_error: "AI metadata is required" }),
    connectionStrength: z.array(z.object({
        destinationId: z.string({ required_error: "Destination ID is required" }).min(1, "Please provide destination id"),
        score: z.number({ required_error: "Score is required" }).positive()
    })).optional(),
});

export const updateDestinationSchema = z.object({
    name: z.string({ invalid_type_error: "Destination name must be a string" }).min(1, "Please provide destination name").optional(),
    description: z.string({ invalid_type_error: "Description must be a string" }).min(10, "Please provide destination description").optional(),
    shortDescription: z.string({ invalid_type_error: "Short description must be a string" }).min(5, "Please provide destination short description").optional(),
    location: z.object({
        address: z.string({ required_error: "Address is required" }).min(1, "Please provide address"),
        pinCode: z.string({ required_error: "Pin code is required" }).min(6, "Please provide pin code"),
        coordinates: z.object({
            lat: z.number({ required_error: "Latitude is required" }),
            lng: z.number({ required_error: "Longitude is required" })
        }).optional(),
        altitude: z.number({ required_error: "Altitude is required" })
    }).optional(),
    mainCity: z.string({ invalid_type_error: "Main city ID must be a string" }).min(1, "Please provide main city id").optional(),
    placeType: z.string({ invalid_type_error: "Place type must be a string" }).min(1, "Please provide place type").optional(),
    categories: z.array(z.string()).min(1, "Please provide at least one category").optional(),
    nearbyDestinations: z.array(z.object({
        destinationId: z.string({ required_error: "Destination ID is required" }).min(1, "Please provide destination id"),
        distance: z.number({ required_error: "Distance is required" }).positive(),
        travelTime: z.number({ required_error: "Travel time is required" }).positive(),
        routeType: z.string({ required_error: "Route type is required" }).min(1, "Please provide route type")
    })).optional(),
    budgetEstimate: z.object({
        dailyAvg: z.number().positive().optional(),
        budget: z.number().positive().optional(),
        luxury: z.number().positive().optional()
    }).optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    aiMetadata: z.object({
        tags: z.array(z.string()).min(1, "Please provide at least one tag").optional(),
        mood: z.array(z.string()).min(1, "Please provide at least one mood").optional(),
        suitableFor: z.array(z.string()).min(1, "Please provide at least one suitable for").optional(),
        travelStyle: z.array(z.string()).min(1, "Please provide at least one travel style").optional(),
        highlights: z.array(z.object({
            title: z.string({ required_error: "Highlight title is required" }).min(1, "Please provide highlight title"),
            description: z.string({ required_error: "Highlight description is required" }).min(1, "Please provide highlight description")
        })).optional(),
    }).optional(),
    connectionStrength: z.array(z.object({
        destinationId: z.string({ required_error: "Destination ID is required" }).min(1, "Please provide destination id"),
        score: z.number({ required_error: "Score is required" }).positive()
    })).optional(),
});
