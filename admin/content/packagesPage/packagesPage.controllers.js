import { PackagesPageSections } from "../../../self/models/packagesPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updatePackagesPageSectionsSchema } from "./packagesPage.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updatePackagesPageSections = async (req, res, next) => {
    try {
        const validate = updatePackagesPageSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let pageData = await PackagesPageSections.findOne();

        if (!pageData) {
            pageData = new PackagesPageSections({ customSections });
            await pageData.save();
        } else {
            pageData.customSections = customSections;
            await pageData.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Packages page custom sections updated successfully", pageData);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update custom sections", next);
    }
};

export const getPackagesPageSections = async (req, res, next) => {
    try {
        const section = await PackagesPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Packages page sections fetched successfully", section || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch packages page sections", next);
    }
};
