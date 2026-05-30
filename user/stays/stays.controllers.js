import StayModel from "../../self/models/stay.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { StaysPageSections } from "../../self/models/staysPage.model.js";
import { StayDetailSections } from "../../self/models/stayDetailSections.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch all stays (for main grid)
export const getAllStays = async (req, res, next) => {
    try {
        console.log("request hit ")
        const stays = await StayModel.find({ isActive: true })
            .select("name slug destinationId location.address priceRange ratings images popularityScore aiScore type aiMetaData")
            .populate("destinationId", "name location.address")
            .sort({ popularityScore: -1, "ratings.average": -1 })
            .limit(12);

        console.log("stays: ", stays);

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

// Fetch stays page custom content sections for UserApp
export const getStaysPageSections = async (req, res, next) => {
    try {
        const sectionsContent = await StaysPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Stays page sections fetched successfully", sectionsContent || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stays page sections", next);
    }
};

// Fetch per-stay custom content sections for UserApp (by slug)
export const getStayDetailSectionsUser = async (req, res, next) => {
    try {
        const { staySlug } = req.params;
        const stay = await StayModel.findOne({ slug: staySlug }).select("_id");
        if (!stay) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay not found", next);
        }
        const sections = await StayDetailSections.findOne({ stayId: stay._id });
        return sendSuccess(res, StatusCodes.OK, "Stay detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stay detail sections", next);
    }
};
