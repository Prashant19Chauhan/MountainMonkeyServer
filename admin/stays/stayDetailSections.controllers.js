import { StayDetailSections } from "../../self/models/stayDetailSections.model.js";
import StayModel from "../../self/models/stay.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { updateStayDetailSectionsSchema } from "./stayDetailSections.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// GET sections for a specific stay (by slug)
export const getStayDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const stay = await StayModel.findOne({ slug }).select("_id");
        if (!stay) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay not found", next);
        }
        const sections = await StayDetailSections.findOne({ stayId: stay._id });
        return sendSuccess(res, StatusCodes.OK, "Stay detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stay detail sections", next);
    }
};

// POST/update sections for a specific stay (by slug)
export const updateStayDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const stay = await StayModel.findOne({ slug }).select("_id");
        if (!stay) {
            return errorHandler(StatusCodes.NOT_FOUND, "Stay not found", next);
        }

        const validate = updateStayDetailSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let detailSections = await StayDetailSections.findOne({ stayId: stay._id });

        if (!detailSections) {
            detailSections = new StayDetailSections({ stayId: stay._id, customSections });
            await detailSections.save();
        } else {
            detailSections.customSections = customSections;
            await detailSections.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Stay detail sections updated successfully", detailSections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update stay detail sections", next);
    }
};
