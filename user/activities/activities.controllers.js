import ActivityModel from "../../self/models/activity.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { ActivitiesPageSections } from "../../self/models/activitiesPage.model.js";
import { ActivityDetailSections } from "../../self/models/activityDetailSections.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch featured/top activities (for the top Bento grid section)
export const getFeaturedActivities = async (req, res, next) => {
    try {
        const activities = await ActivityModel.find({ isActive: true })
            .select("name slug destinationId images pricing ratings timing tags category shortDescription")
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
            .select("name slug destinationId images pricing ratings timing tags category shortDescription")
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
            .select("name slug destinationId images pricing ratings timing tags category shortDescription longDescription")
            .populate("destinationId", "name location.address")
            .sort({ createdAt: -1 })
            .limit(10);

        return sendSuccess(res, StatusCodes.OK, "Explore activities fetched successfully", activities);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch explore activities", next);
    }
};

// Fetch all activities (for client-side category filtering in dynamic category panels)
export const getAllActivities = async (req, res, next) => {
    try {
        const activities = await ActivityModel.find({ isActive: true })
            .select("name slug destinationId images pricing ratings tags category shortDescription popularityScore")
            .populate("destinationId", "name location.address")
            .sort({ popularityScore: -1, "ratings.average": -1 })
            .limit(60);

        return sendSuccess(res, StatusCodes.OK, "All activities fetched successfully", activities);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch all activities", next);
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

// Fetch activities page custom content sections for UserApp
export const getActivitiesPageSections = async (req, res, next) => {
    try {
        const sectionsContent = await ActivitiesPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Activities page sections fetched successfully", sectionsContent || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch activities page sections", next);
    }
};

// Fetch per-activity custom content sections for UserApp (by slug)
export const getActivityDetailSectionsUser = async (req, res, next) => {
    try {
        const { activitySlug } = req.params;
        const activity = await ActivityModel.findOne({ slug: activitySlug }).select("_id");
        if (!activity) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found", next);
        }
        const sections = await ActivityDetailSections.findOne({ activityId: activity._id });
        return sendSuccess(res, StatusCodes.OK, "Activity detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch activity detail sections", next);
    }
};
