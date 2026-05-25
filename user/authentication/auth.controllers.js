import SessionModel from "./auth.model.js";
import UserModel from "../self/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { generateToken, generateRefreshToken } from "../../self/utility/token.utils.js";
import { registerUserSchema, loginUserSchema } from "./auth.validations.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── REGISTER ───────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
    try {
        const data = req.body;

        const validatedData = registerUserSchema.safeParse(data);
        if (!validatedData.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validatedData.error), next);
        }

        const existingUser = await UserModel.findOne({ email: validatedData.data.email });
        if (existingUser) {
            return errorHandler(StatusCodes.CONFLICT, "An account with this email already exists", next);
        }

        const hashedPassword = await bcrypt.hash(validatedData.data.password, 10);

        const user = new UserModel({ ...validatedData.data, password: hashedPassword });
        await user.save();

        const safeUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            scope: "user",
        };

        const accessToken = generateToken(safeUser, "1m");
        const refreshToken = generateRefreshToken(safeUser, "7d");

        await SessionModel.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return res
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(StatusCodes.CREATED)
            .json({
                success: true,
                statusCode: StatusCodes.CREATED,
                message: "Account registered successfully",
                data: { user: safeUser, accessToken },
            });

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Registration failed", next);
    }
};

// ── LOGIN ──────────────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
    try {
        const validatedData = loginUserSchema.safeParse(req.body);
        if (!validatedData.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validatedData.error), next);
        }

        const { email, password } = validatedData.data;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return errorHandler(StatusCodes.NOT_FOUND, "No account found with this email address", next);
        }

        if (user.isDeleted) {
            return errorHandler(StatusCodes.GONE, "This account no longer exists", next);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorHandler(StatusCodes.UNAUTHORIZED, "Incorrect password. Please try again", next);
        }

        const safeUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            scope: "user",
        };

        const accessToken = generateToken(safeUser, "15d");
        const refreshToken = generateRefreshToken(safeUser, "7d");

        await SessionModel.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return res
            .cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(StatusCodes.OK)
            .json({
                success: true,
                statusCode: StatusCodes.OK,
                message: "Logged in successfully",
                data: { user: safeUser, accessToken },
            });

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Login failed", next);
    }
};

// ── LOGOUT ─────────────────────────────────────────────────────────────────

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return errorHandler(StatusCodes.BAD_REQUEST, "No active session found — refresh token is missing", next);
        }

        const session = await SessionModel.findOneAndUpdate(
            { refreshToken },
            { $set: { isActive: false } }
        );

        if (!session) {
            return errorHandler(StatusCodes.NOT_FOUND, "Session not found or already expired", next);
        }

        return res
            .clearCookie("refresh_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .status(StatusCodes.OK)
            .json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Logout failed", next);
    }
};

// ── GOOGLE LOGIN (placeholder) ─────────────────────────────────────────────

export const googleLogin = (req, res, next) => {
    return errorHandler(StatusCodes.NOT_IMPLEMENTED, "Google login is not yet implemented", next);
};