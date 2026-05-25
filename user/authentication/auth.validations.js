import {z} from "zod";

export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const registerUserSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(10).max(10),
    countriesVisited: z.array(z.string()).optional(),
    dreamDestination: z.array(z.string()).optional(),
    travelTypes: z.array(z.string()).optional(),
    frequency: z.string().optional(),
    adventureLevel: z.number().optional(),
    bio: z.string().optional(),
    language: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    pincode: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(["user", "creator"]),
    isProfileCompleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
});
