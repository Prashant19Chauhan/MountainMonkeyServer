import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import AdminModel from "../self/admin.model.js";
import AdminSession from "../authentication/auth.model.js";

// ── UPDATE PROFILE ─────────────────────────────────────────────────────────

export const updateProfileController = async (req, res, next) => {
    try {
        const adminId = req.user._id;

        if (!req.body || Object.keys(req.body).length === 0) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Request body is required to update profile", next);
        }

        const updatedAdmin = await AdminModel.findByIdAndUpdate(adminId, req.body, { new: true }).select("-password");

        if (!updatedAdmin) {
            return errorHandler(StatusCodes.NOT_FOUND, "Admin profile not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Profile updated successfully", updatedAdmin);

    } catch (err) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update profile", next);
    }
};

// ── GET PROFILE ────────────────────────────────────────────────────────────

export const getProfileController = async (req, res, next) => {
    try {
        const adminId = req.user._id;

        const admin = await AdminModel.findById(adminId).select("-password");

        if (!admin) {
            return errorHandler(StatusCodes.NOT_FOUND, "Admin profile not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Profile fetched successfully", admin);

    } catch (err) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch profile", next);
    }
};

// ── DELETE PROFILE ─────────────────────────────────────────────────────────

export const deleteProfileController = async (req, res, next) => {
    try {
        const adminId = req.user._id;

        const adminToDelete = await AdminModel.findOne({ _id: adminId });
        if (!adminToDelete) {
            return errorHandler(StatusCodes.NOT_FOUND, "Admin profile not found", next);
        }

        const session = await AdminSession.findOne({ adminId });
        if (!session) {
            return errorHandler(StatusCodes.NOT_FOUND, "Active session not found", next);
        }

        adminToDelete.isDeleted = true;
        session.isActive = false;

        await Promise.all([adminToDelete.save(), session.save()]);

        res.clearCookie("refreshToken");

        return sendSuccess(res, StatusCodes.OK, "Profile deleted successfully");

    } catch (err) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete profile", next);
    }
};
