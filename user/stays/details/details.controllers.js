import StayModel from "../../../self/models/stay.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import LocalInfoModel from "../../../self/models/localInfo.model.js";

export const getStayDetails = async (req, res, next) => {
    try {
        const { staySlug } = req.params;

        let query = {};
        if (staySlug.match(/^[0-9a-fA-F]{24}$/)) {
            query = { $or: [{ _id: staySlug }, { slug: staySlug }] };
        } else {
            query = { slug: staySlug };
        }

        const stayDetails = await StayModel.findOne(query)
            .select("-embedding -isActive -location.coordinates -location.mainCity -lastUpdated -createdAt -updatedAt -__v")
            .populate("metaDataId", "-_id -pageId -adminId -lastModified")
            .lean();

        if (!stayDetails) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay details not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Stay details fetched successfully", stayDetails);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stay details", next);
    }
};

export const getStayLocalInfo = async (req, res, next) => {
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