import StayModel from "../../self/models/stay.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { staySchemaValidation } from "./staySchema.validations.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createStay = async (req, res, next) => {
    try {
        const data = { ...req.body, adminId: req.user?._id };

        const validate = staySchemaValidation.safeParse(data);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        // Prevent duplicate stay with same name in same city
        const existing = await StayModel.findOne({
            name: data.name,
            mainCity: data.mainCity,
        });

        if (existing) {
            return errorHandler(StatusCodes.CONFLICT, "A stay with this name already exists in the selected city", next);
        }

        const stay = new StayModel({ ...validate.data });
        await stay.save();

        return sendSuccess(res, StatusCodes.CREATED, "Stay created successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create stay", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateStay = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Stay ID is required", next);
        }

        const validate = staySchemaValidation.partial().safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        // Check for name-city conflict with another stay
        if (req.body.name && req.body.mainCity) {
            const existing = await StayModel.findOne({
                name: req.body.name,
                mainCity: req.body.mainCity,
                _id: { $ne: id },
            });

            if (existing) {
                return errorHandler(StatusCodes.CONFLICT, "A stay with this name already exists in the selected city", next);
            }
        }

        const stay = await StayModel.findOne({ adminId, _id: id });

        if (!stay) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay not found or you do not have permission to update it", next);
        }

        Object.assign(stay, validate.data);
        await stay.save();

        return sendSuccess(res, StatusCodes.OK, "Stay updated successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update stay", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteStay = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Stay ID is required", next);
        }

        const deleted = await StayModel.findOneAndDelete({ adminId, _id: id });

        if (!deleted) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay not found or you do not have permission to delete it", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Stay deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete stay", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getStay = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Stay ID is required", next);
        }

        const stay = await StayModel.findOne({ adminId, _id: id })
            .select("-embedding")
            .populate("mainCity", "name")
            .populate("destinationId", "name");

        if (!stay) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Stay fetched successfully", stay);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to get stay", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllStays = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        let { page = 1, limit = 10, destinationId, type, minPrice, maxPrice } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = {};

        if (destinationId) filter["destination.id"] = destinationId;
        if (type) filter.type = type;
        if (minPrice || maxPrice) {
            filter["priceRange.min"] = { $gte: Number(minPrice || 0) };
            filter["priceRange.max"] = { $lte: Number(maxPrice || 1000000) };
        }

        const [stays, total] = await Promise.all([
            StayModel.find({ adminId, ...filter })
                .select("-embedding")
                .populate("destinationId", "name")
                .populate("mainCity", "name")
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ popularityScore: -1 }),
            StayModel.countDocuments({ adminId, ...filter }),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Stays fetched successfully",
            stays,
            {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to get stays", next);
    }
};