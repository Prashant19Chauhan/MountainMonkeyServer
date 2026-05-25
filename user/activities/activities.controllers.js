import ActivityModel from "../../self/models/activity.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch featured/top activities (for the top Bento grid section)
export const getFeaturedActivities = async (req, res, next) => {
    try {
        const activities = await ActivityModel.find({ isActive: true })
            .select("name destinationId images pricing ratings timing tags category shortDescription")
            .populate("destinationId", "name location.address")
            .sort({ popularityScore: -1, "ratings.average": -1 })
            .limit(3);

        return sendSuccess(res, StatusCodes.OK, "Featured activities fetched successfully", activities);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch featured activities", next);
    }
};

// Fetch popular activities (for Middle Grid section, skips first 3)
export const getPopularActivities = async (req, res, next) => {
    try {
        const activities = await ActivityModel.find({ isActive: true })
            .select("name destinationId images pricing ratings timing tags category shortDescription")
            .populate("destinationId", "name location.address")
            .sort({ popularityScore: -1, "ratings.average": -1 })
            .skip(3)
            .limit(2);

        return sendSuccess(res, StatusCodes.OK, "Popular activities fetched successfully", activities);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch popular activities", next);
    }
};

// Fetch explore activities (for More to Explore bottom list)
export const getExploreActivities = async (req, res, next) => {
    try {
        const activities = await ActivityModel.find({ isActive: true })
            .select("name destinationId images pricing ratings timing tags category shortDescription longDescription")
            .populate("destinationId", "name location.address")
            .sort({ createdAt: -1 })
            .limit(10);

        return sendSuccess(res, StatusCodes.OK, "Explore activities fetched successfully", activities);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch explore activities", next);
    }
};

// Fetch advertisements for activities page
export const getActivityAdvertisements = async (req, res, next) => {
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
