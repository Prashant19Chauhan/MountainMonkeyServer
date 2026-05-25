import { Location } from "../../self/models/locations.models.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createLocationSchema, deleteLocationSchema, updateLocationSchema } from "./locationsSchema.validations.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createLocation = async (req, res, next) => {
    try {
        const validationResult = createLocationSchema.safeParse(req.body);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.create(validationResult.data);

        return sendSuccess(res, StatusCodes.CREATED, "Location created successfully", location);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create location", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteLocation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = deleteLocationSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findByIdAndDelete(id);

        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "Location not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Location deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete location", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateLocation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = updateLocationSchema.safeParse(req.body);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findByIdAndUpdate(id, validationResult.data, { new: true });

        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "Location not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Location updated successfully", location);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update location", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllLocations = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { country: { $regex: search, $options: "i" } },
                    { state: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const [locations, total] = await Promise.all([
            Location.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Location.countDocuments(filter),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Locations fetched successfully",
            locations,
            {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get locations", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getCityById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = deleteLocationSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findById(id);

        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "Location not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Location fetched successfully", location);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get location", next);
    }
};
