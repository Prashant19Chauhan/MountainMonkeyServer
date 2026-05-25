import { ThemeMetaData } from "../../self/models/theme.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

/**
 * @desc Get application metadata for the user (moods and background theme)
 * @route GET /mm/api/user/theme-meta-data
 * @access Public/User
 */
export const getThemeMetaData = async (req, res, next) => {
    try {
        const metaData = await ThemeMetaData.findOne();
        return sendSuccess(
            res,
            StatusCodes.OK,
            "Theme meta data fetched successfully",
            metaData || { moods: [], travelStyle: [], theme: [] }
        );
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch theme meta data", next);
    }
}
