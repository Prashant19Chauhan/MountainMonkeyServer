import Advertisement from "../../self/models/advertisement.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createAdvertisement = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Request body is required", next);
        }

        const advertisement = new Advertisement(req.body);
        const savedAd = await advertisement.save();

        return sendSuccess(res, StatusCodes.CREATED, "Advertisement created successfully", savedAd);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create advertisement", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAdvertisements = async (req, res, next) => {
    try {
        const advertisements = await Advertisement.find().sort({ priority: -1, createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Advertisements fetched successfully", advertisements);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch advertisements", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getAdvertisementById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Advertisement ID is required", next);
        }

        const advertisement = await Advertisement.findById(id);

        if (!advertisement) {
            return errorHandler(StatusCodes.NOT_FOUND, "Advertisement not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Advertisement fetched successfully", advertisement);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch advertisement", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateAdvertisement = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Advertisement ID is required", next);
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Request body is required to update an advertisement", next);
        }

        const updatedAd = await Advertisement.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedAd) {
            return errorHandler(StatusCodes.NOT_FOUND, "Advertisement not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Advertisement updated successfully", updatedAd);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update advertisement", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteAdvertisement = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Advertisement ID is required", next);
        }

        const advertisement = await Advertisement.findByIdAndDelete(id);

        if (!advertisement) {
            return errorHandler(StatusCodes.NOT_FOUND, "Advertisement not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Advertisement deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete advertisement", next);
    }
};
