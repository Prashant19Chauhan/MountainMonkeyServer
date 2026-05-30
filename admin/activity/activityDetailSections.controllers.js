import { ActivityDetailSections } from "../../self/models/activityDetailSections.model.js";
import Activity from "../../self/models/activity.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { updateActivityDetailSectionsSchema } from "./activityDetailSections.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// GET sections for a specific activity (by slug)
export const getActivityDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const activity = await Activity.findOne({ slug }).select("_id");
        if (!activity) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found", next);
        }
        const sections = await ActivityDetailSections.findOne({ activityId: activity._id });
        return sendSuccess(res, StatusCodes.OK, "Activity detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch activity detail sections", next);
    }
};

// POST/update sections for a specific activity (by slug)
export const updateActivityDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const activity = await Activity.findOne({ slug }).select("_id");
        if (!activity) {
            return errorHandler(StatusCodes.NOT_FOUND, "Activity not found", next);
        }

        const validate = updateActivityDetailSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let detailSections = await ActivityDetailSections.findOne({ activityId: activity._id });

        if (!detailSections) {
            detailSections = new ActivityDetailSections({ activityId: activity._id, customSections });
            await detailSections.save();
        } else {
            detailSections.customSections = customSections;
            await detailSections.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Activity detail sections updated successfully", detailSections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update activity detail sections", next);
    }
};
