import { FaqPageSections } from "../../self/models/faqPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getFaqPageSectionsUser = async (req, res, next) => {
  try {
    const pageData = await FaqPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "FAQ page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch FAQ page sections", next);
  }
};
