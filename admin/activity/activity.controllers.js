import Activity from "../../self/models/activity.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { activityValidationSchema } from "./activitySchema.validation.js";

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extracts the first meaningful validation error message from Zod issues.
 * Includes field path so the client knows which field failed.
 */
const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "field";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createActivity = async (req, res, next) => {
    try {
        const data = req.body;
        const adminId = req.user?._id;

        const validation = activityValidationSchema.safeParse(data);
        if (!validation.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validation.error), next);
        }

        const validatedData = validation.data;

        const activity = await Activity.create({
            ...validatedData,
            adminId,
        });

        return sendSuccess(res, StatusCodes.CREATED, "Activity created successfully", activity);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create activity", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Activity ID is required", next);
        }

        const validation = activityValidationSchema.partial().safeParse(data);
        if (!validation.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validation.error), next);
        }

        const validatedData = validation.data;

        const activity = await Activity.findOneAndUpdate(
            { _id: id, adminId },
            { ...validatedData },
            { new: true, runValidators: true }
        );

        if (!activity) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found or you do not have permission to update it", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Activity updated successfully", activity);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update activity", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Activity ID is required", next);
        }

        const activity = await Activity.findOne({ _id: id, adminId });
        if (!activity) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found or you do not have permission to delete it", next);
        }

        await activity.deleteOne();

        return sendSuccess(res, StatusCodes.OK, "Activity deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete activity", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Activity ID is required", next);
        }

        const activity = await Activity.findOne({ _id: id, adminId })
            .select("-embedding")
            .populate("destinationId", "name")
            .populate("location.mainCity", "name");

        if (!activity) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Activity fetched successfully", activity);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get activity", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllActivities = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { shortDescription: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const [activities, count] = await Promise.all([
            Activity.find({ adminId, ...query })
                .select("-embedding")
                .populate("destinationId", "name")
                .populate("location.mainCity", "name")
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Activity.countDocuments({ adminId, ...query }),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Activities fetched successfully",
            activities,
            {
                totalActivities: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get activities", next);
    }
};
