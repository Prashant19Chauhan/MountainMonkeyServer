import Destination from "../../self/models/destination.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { generateSlug } from "../../self/utility/slug.utils.js";
import { createDestinationSchema, updateDestinationSchema } from "./destinationSchema.validation.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createDestination = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        const data = { ...req.body, adminId };

        const validationResult = createDestinationSchema.safeParse(data);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const slug = generateSlug(data.name);

        const destination = new Destination({
            ...validationResult.data,
            slug,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await destination.save();

        return sendSuccess(res, StatusCodes.CREATED, "Destination created successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create destination", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getDestinationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Destination ID is required", next);
        }


        const destination = await Destination.findOne({ _id: id, adminId })
            .select("-aiMetadata.embedding")
            .populate("mainCity", "name")
            .populate("nearbyDestinations.destinationId", "name images");

        console.log("destination:", destination);

        if (!destination) {
            return errorHandler(StatusCodes.NOT_FOUND, "Destination not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Destination fetched successfully", destination);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destination", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllDestinations = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { "location.address": { $regex: search, $options: "i" } },
                    { placeType: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const [destinations, total] = await Promise.all([
            Destination.find({ adminId, ...filter })
                .select("_id name images location.address location.pinCode status placeType ratings")
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Destination.countDocuments({ adminId, ...filter }),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Destinations fetched successfully",
            destinations,
            {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destinations", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteDestination = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Destination ID is required", next);
        }

        const destination = await Destination.findOne({ _id: id, adminId });
        if (!destination) {
            return errorHandler(StatusCodes.NOT_FOUND, "Destination not found or you do not have permission to delete it", next);
        }

        await Destination.deleteOne({ _id: id, adminId });

        return sendSuccess(res, StatusCodes.OK, "Destination deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete destination", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

/**
 * @desc Update destination
 * @route PUT /api/destinations/:id
 * @access Admin
 */
export const updateDestination = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;
        let data = req.body;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Destination ID is required", next);
        }

        const validationResult = updateDestinationSchema.safeParse(data);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const destination = await Destination.findOne({ adminId, _id: id });
        if (!destination) {
            return errorHandler(StatusCodes.NOT_FOUND, "Destination not found or you do not have permission to update it", next);
        }

        let updateData = { ...validationResult.data };

        if (updateData.name) {
            updateData.slug = generateSlug(updateData.name);
        }

        if (updateData.aiMetadata) {
            updateData.aiMetadata = {
                ...destination.aiMetadata.toObject(),
                ...updateData.aiMetadata,
            };
        }

        updateData.updatedAt = new Date();

        const updatedDestination = await Destination.findOneAndUpdate(
            { _id: id, adminId },
            updateData,
            { new: true, runValidators: true }
        );

        return sendSuccess(res, StatusCodes.OK, "Destination updated successfully", updatedDestination);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update destination", next);
    }
};
