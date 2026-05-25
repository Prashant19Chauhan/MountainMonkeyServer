import {z} from "zod";

const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email("Invalid email format"),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(1, "Password cannot be empty"),
})

const registerSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).min(1, "Name cannot be empty"),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email("Invalid email format"),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(1, "Password cannot be empty"),
    role: z.string({
        required_error: "Role is required",
        invalid_type_error: "Role must be a string",
    }).min(1, "Role cannot be empty"),
})

export default {loginSchema, registerSchema}