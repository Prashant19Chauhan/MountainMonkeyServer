import { DestinationsPageSections } from "../../../self/models/destinationsPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateDestinationsPageSectionsSchema } from "./destinationsPage.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateDestinationsPageSections = async (req, res, next) => {
    try {
        const validate = updateDestinationsPageSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let pageData = await DestinationsPageSections.findOne();

        if (!pageData) {
            pageData = new DestinationsPageSections({ customSections });
            await pageData.save();
        } else {
            pageData.customSections = customSections;
            await pageData.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Destinations page custom sections updated successfully", pageData);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update custom sections", next);
    }
};

export const getDestinationsPageSections = async (req, res, next) => {
    try {
        const section = await DestinationsPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Destinations page sections fetched successfully", section || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destinations page sections", next);
    }
};
