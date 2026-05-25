import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import userModel from "../self/user.model.js";
import sessionModel from "../authentication/auth.model.js";

// ── UPDATE PROFILE ─────────────────────────────────────────────────────────

export const updateProfile = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        if (!req.body || Object.keys(req.body).length === 0) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Request body is required to update profile", next);
        }

        const { name_as_traveler, country, address, pincode, state, city, language } = req.body;

        const user = await userModel.findById(user_id);
        if (!user) {
            return errorHandler(StatusCodes.NOT_FOUND, "User not found", next);
        }

        if (name_as_traveler !== undefined) user.name_as_traveler = name_as_traveler;
        if (country !== undefined) user.country = country;
        if (address !== undefined) user.address = address;
        if (pincode !== undefined) user.pincode = pincode;
        if (state !== undefined) user.state = state;
        if (city !== undefined) user.city = city;
        if (language !== undefined) user.language = language;

        await user.save();

        return sendSuccess(res, StatusCodes.OK, "Profile updated successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update profile", next);
    }
};

// ── GET PROFILE ────────────────────────────────────────────────────────────

export const getProfile = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        const user = await userModel.findOne({ _id: user_id, isDeleted: false }).select("-password");
        if (!user) {
            return errorHandler(StatusCodes.NOT_FOUND, "User profile not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Profile fetched successfully", user);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch profile", next);
    }
};

// ── DELETE PROFILE ─────────────────────────────────────────────────────────

export const deleteProfile = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        const user = await userModel.findById(user_id);
        if (!user || user.isDeleted === true) {
            return errorHandler(StatusCodes.NOT_FOUND, "User not found", next);
        }

        const session = await sessionModel.findOne({ userId: user_id });
        if (session) {
            session.isActive = false;
            await session.save();
        }

        user.isDeleted = true;
        await user.save();

        return res
            .clearCookie("refresh_token", { httpOnly: true, secure: true })
            .status(StatusCodes.OK)
            .json({ success: true, message: "Profile deleted successfully" });

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete profile", next);
    }
};