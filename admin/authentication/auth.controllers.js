import AdminSessionModel from "./auth.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import AdminModel from "../self/admin.model.js";
import bcrypt from "bcrypt";
import { generateToken, generateRefreshToken } from "../../self/utility/token.utils.js";
import authSchema from "./authSchema.validation.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── LOGIN ──────────────────────────────────────────────────────────────────

const loginAdmin = async (req, res, next) => {
    try {
        const result = authSchema.loginSchema.safeParse(req.body);
        if (!result.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(result.error), next);
        }

        const { email, password } = result.data;

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return errorHandler(StatusCodes.NOT_FOUND, "No account found with this email address", next);
        }
        if (!admin.isVerified) {
            return errorHandler(StatusCodes.FORBIDDEN, "Your account has not been verified yet. Please contact support", next);
        }
        if (admin.isSuspended) {
            return errorHandler(StatusCodes.FORBIDDEN, "Your account has been suspended. Please contact support", next);
        }
        if (admin.isDeleted) {
            return errorHandler(StatusCodes.GONE, "This account no longer exists", next);
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return errorHandler(StatusCodes.UNAUTHORIZED, "Incorrect password. Please try again", next);
        }

        const safeUser = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            scope: "admin",
        };

        const accessToken = generateToken(safeUser, "15d");
        const refreshToken = generateRefreshToken(safeUser, "7d");

        const session = new AdminSessionModel({ adminId: admin._id, refreshToken });
        await session.save();

        return res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
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
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Login failed. Please try again later", next);
    }
};

// ── REGISTER ───────────────────────────────────────────────────────────────

const registerAdmin = async (req, res, next) => {
    try {
        const result = authSchema.registerSchema.safeParse(req.body);
        if (!result.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(result.error), next);
        }

        const { name, email, password, role } = result.data;

        const existing = await AdminModel.findOne({ email });
        if (existing) {
            return errorHandler(StatusCodes.CONFLICT, "An account with this email already exists", next);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new AdminModel({ name, email, password: hashedPassword, role });
        await admin.save();

        const safeUser = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            scope: "admin",
        };

        const accessToken = generateToken(safeUser, "15d");
        const refreshToken = generateRefreshToken(safeUser, "7d");

        const session = new AdminSessionModel({ adminId: admin._id, refreshToken });
        await session.save();

        return res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
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
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Registration failed. Please try again later", next);
    }
};

// ── LOGOUT ─────────────────────────────────────────────────────────────────

const logoutAdmin = async (req, res, next) => {
    try {
        const adminId = req.user._id;

        const session = await AdminSessionModel.findOne({ adminId });
        if (!session) {
            return errorHandler(StatusCodes.UNAUTHORIZED, "No active session found", next);
        }

        session.isActive = false;
        await session.save();

        res.clearCookie("refreshToken");

        return sendSuccess(res, StatusCodes.OK, "Logged out successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Logout failed. Please try again", next);
    }
};

export { loginAdmin, registerAdmin, logoutAdmin };