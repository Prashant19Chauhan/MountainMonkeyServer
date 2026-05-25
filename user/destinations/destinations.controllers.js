import DestinationModel from "../../self/models/destination.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch all active destinations (e.g., for horizontal scroll)
export const getAllDestinations = async (req, res, next) => {
    try {
        const destinations = await DestinationModel.find({ status: "Active" })
            .select("name slug images shortDescription")
            .sort({ createdAt: -1 })
            .limit(15);

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
