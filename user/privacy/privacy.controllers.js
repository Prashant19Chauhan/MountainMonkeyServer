import { PrivacyPageSections } from "../../self/models/privacyPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getPrivacyPageSectionsUser = async (req, res, next) => {
  try {
    const pageData = await PrivacyPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "Privacy page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch privacy page sections", next);
  }
};
