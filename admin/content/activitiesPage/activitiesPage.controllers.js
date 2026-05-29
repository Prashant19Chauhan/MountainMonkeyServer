import { ActivitiesPageSections } from "../../../self/models/activitiesPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateActivitiesPageSectionsSchema } from "./activitiesPage.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateActivitiesPageSections = async (req, res, next) => {
    try {
        const validate = updateActivitiesPageSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let pageData = await ActivitiesPageSections.findOne();

        if (!pageData) {
            pageData = new ActivitiesPageSections({ customSections });
            await pageData.save();
        } else {
            pageData.customSections = customSections;
            await pageData.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Activities page custom sections updated successfully", pageData);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update custom sections", next);
    }
};

export const getActivitiesPageSections = async (req, res, next) => {
    try {
        const section = await ActivitiesPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Activities page sections fetched successfully", section || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch activities page sections", next);
    }
};
