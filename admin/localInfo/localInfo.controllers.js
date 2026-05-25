import LocalInfo from "../../self/models/localInfo.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createLocalInfoSchema } from "./localInfoSchema.validation.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createLocalInfo = async (req, res, next) => {
    try {
        const dataBody = { ...req.body, lastUpdated: new Date() };
        const adminId = req.user?._id;

        const validation = createLocalInfoSchema.safeParse(dataBody);
        if (!validation.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validation.error), next);
        }

        const data = validation.data;

        const existing = await LocalInfo.findOne({
            destinationId: data?.destinationId,
            adminId,
        });

        if (existing) {
            return errorHandler(StatusCodes.CONFLICT, "Local info already exists for this destination", next);
        }

        const localInfo = new LocalInfo({ ...data, adminId });
        await localInfo.save();

        return sendSuccess(res, StatusCodes.CREATED, "Local info created successfully", localInfo);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create local info", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllLocalInfo = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const [data, total] = await Promise.all([
            LocalInfo.find({ adminId })
                .populate("destinationId", "name")
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            LocalInfo.countDocuments({ adminId }),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Local info list fetched successfully",
            data,
            {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch local info list", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getLocalInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Local info ID is required", next);
        }

        const data = await LocalInfo.findOne({ _id: id, adminId }).populate("destinationId", "name");

        if (!data) {
            return errorHandler(StatusCodes.NOT_FOUND, "Local info not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Local info fetched successfully", data);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch local info", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateLocalInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Local info ID is required", next);
        }

        const dataBody = { ...req.body, lastUpdated: new Date() };

        const validation = createLocalInfoSchema.partial().safeParse(dataBody);
        if (!validation.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validation.error), next);
        }

        const updated = await LocalInfo.findOneAndUpdate(
            { _id: id, adminId },
            { ...validation.data, lastUpdated: new Date() },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return errorHandler(StatusCodes.NOT_FOUND, "Local info not found or you do not have permission to update it", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Local info updated successfully", updated);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update local info", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteLocalInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Local info ID is required", next);
        }

        const deleted = await LocalInfo.findOneAndDelete({ _id: id, adminId });

        if (!deleted) {
            return errorHandler(StatusCodes.NOT_FOUND, "Local info not found or you do not have permission to delete it", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Local info deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete local info", next);
    }
};