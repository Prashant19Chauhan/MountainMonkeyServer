import StayModel from "../../self/models/stay.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch all stays (for main grid)
export const getAllStays = async (req, res, next) => {
    try {
        const stays = await StayModel.find({ isActive: true })
            .select("name destinationId location.address priceRange ratings images popularityScore aiScore type aiMetaData")
            .populate("destinationId", "name location.address")
            .sort({ popularityScore: -1, "ratings.average": -1 })
            .limit(12);

        return sendSuccess(res, StatusCodes.OK, "Stays fetched successfully", stays);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stays", next);
    }
};

// Fetch advertisements for stays page
export const getStayAdvertisements = async (req, res, next) => {
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
