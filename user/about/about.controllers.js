import { AboutPageSections } from "../../self/models/aboutPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch about page dynamic layout sections for UserApp
export const getAboutPageSectionsUser = async (req, res, next) => {
    try {
        const sectionsContent = await AboutPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "About page sections fetched successfully", sectionsContent || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch about page sections", next);
    }
};
