import { AboutPageSections } from "../../../self/models/aboutPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateAboutPageSectionsSchema } from "./aboutPage.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateAboutPageSections = async (req, res, next) => {
    try {
        const validate = updateAboutPageSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { hero, customSections } = validate.data;

        let pageData = await AboutPageSections.findOne();

        if (!pageData) {
            pageData = new AboutPageSections({ hero, customSections });
            await pageData.save();
        } else {
            pageData.hero = hero;
            pageData.customSections = customSections;
            await pageData.save();
        }

        return sendSuccess(res, StatusCodes.OK, "About page content saved successfully", pageData);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update about page sections", next);
    }
};

export const getAboutPageSections = async (req, res, next) => {
    try {
        const section = await AboutPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "About page sections fetched successfully", section || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch about page sections", next);
    }
};
