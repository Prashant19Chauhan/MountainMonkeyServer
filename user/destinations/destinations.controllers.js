import DestinationModel from "../../self/models/destination.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { DestinationsPageSections } from "../../self/models/destinationsPage.model.js";
import { DestinationDetailSections } from "../../self/models/destinationDetailSections.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch all active destinations (e.g., for horizontal scroll)
export const getAllDestinations = async (req, res, next) => {
    try {
        const destinations = await DestinationModel.find({ status: "Active" })
            .select("name slug images shortDescription location categories ratings")
            .sort({ createdAt: -1 })
            .limit(30);

        return sendSuccess(res, StatusCodes.OK, "Destinations fetched successfully", destinations);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destinations", next);
    }
};

// Fetch trending destinations based on bookings/popularity
export const getTrendingDestinations = async (req, res, next) => {
    try {
        const trendingDestinations = await DestinationModel.find({ status: "Active" })
            .sort({ "analytics.bookings": -1, "analytics.clicks": -1 })
            .limit(3)
            .select("name slug images shortDescription location categories ratings");

        return sendSuccess(res, StatusCodes.OK, "Trending destinations fetched successfully", trendingDestinations);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch trending destinations", next);
    }
};

// Fetch tropical paradises (filter by categories)
export const getTropicalDestinations = async (req, res, next) => {
    try {
        const tropicalRegex = /beach|island|tropical|coastal/i;

        const tropicalDestinations = await DestinationModel.find({
            status: "Active",
            categories: { $regex: tropicalRegex }
        })
        .limit(8)
        .select("name slug images location categories");

        return sendSuccess(res, StatusCodes.OK, "Tropical destinations fetched successfully", tropicalDestinations);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch tropical destinations", next);
    }
};

// Fetch rich history destinations
export const getHistoryDestinations = async (req, res, next) => {
    try {
        const historyRegex = /historic|history|culture|heritage|ancient/i;

        const historyDestinations = await DestinationModel.find({
            status: "Active",
            categories: { $regex: historyRegex }
        })
        .limit(4)
        .select("name slug images shortDescription location categories");

        return sendSuccess(res, StatusCodes.OK, "History destinations fetched successfully", historyDestinations);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch history destinations", next);
    }
};

export const getDestinationAdvertisements = async (req, res, next) => {
    try {
        const { placement } = req.query;
        const query = { status: "active" };
        if (placement) query.placement = placement;

        const advertisements = await Advertisement.find(query).sort({ priority: -1, createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Advertisements fetched successfully", advertisements);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch advertisements", next);
    }
};

export const getDestinationsPageSections = async (req, res, next) => {
    try {
        const sectionsContent = await DestinationsPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Destinations page sections fetched successfully", sectionsContent || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destinations page sections", next);
    }
};

// Fetch per-destination custom content sections for UserApp (by slug)
export const getDestinationDetailSectionsUser = async (req, res, next) => {
    try {
        const { destinationSlug } = req.params;
        const destination = await DestinationModel.findOne({ slug: destinationSlug }).select("_id");
        if (!destination) {
            return errorHandler(StatusCodes.NOT_FOUND, "Destination not found", next);
        }
        const sections = await DestinationDetailSections.findOne({ destinationId: destination._id });
        return sendSuccess(res, StatusCodes.OK, "Destination detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destination detail sections", next);
    }
};
