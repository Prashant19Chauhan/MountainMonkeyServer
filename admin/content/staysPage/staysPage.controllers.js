import { StaysPageSections } from "../../../self/models/staysPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateStaysPageSectionsSchema } from "./staysPage.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateStaysPageSections = async (req, res, next) => {
    try {
        const validate = updateStaysPageSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let pageData = await StaysPageSections.findOne();

        if (!pageData) {
            pageData = new StaysPageSections({ customSections });
            await pageData.save();
        } else {
            pageData.customSections = customSections;
            await pageData.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Stays page custom sections updated successfully", pageData);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update custom sections", next);
    }
};

export const getStaysPageSections = async (req, res, next) => {
    try {
        const section = await StaysPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Stays page sections fetched successfully", section || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stays page sections", next);
    }
};
