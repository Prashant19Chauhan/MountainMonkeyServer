import ActivitiesModel from "../../../self/models/activity.model.js";
import LocalInfoModel from "../../../self/models/localInfo.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";

export const getActivityDetails = async (req, res, next) => {
    try {
        const { activitySlug } = req.params;

        let query = {};
        if (activitySlug.match(/^[0-9a-fA-F]{24}$/)) {
            query = { $or: [{ _id: activitySlug }, { slug: activitySlug }] };
        } else {
            query = { slug: activitySlug };
        }

        const activityDetails = await ActivitiesModel.findOne(query)
            .select("-isActive -embedding -aiSummary -location.coordinates -location.mainCity")
            .populate("metaDataId", "-_id -pageId -adminId -lastModified")
            .lean();

        if (!activityDetails) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Activity details fetched successfully", activityDetails);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch activity details", next);
    }
};

export const getDestinationLocalInfo = async (req, res, next) => {
    try {
        const { destinationId } = req.params;

        const destinationLocalInfo = await LocalInfoModel.find({ destinationId })
            .select("-destinationId -embedding -lastUpdated -createdAt -updatedAt -__v -aiSummary")
            .lean();

        return sendSuccess(res, StatusCodes.OK, "Local info fetched successfully", destinationLocalInfo || []);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch local info", next);
    }
};