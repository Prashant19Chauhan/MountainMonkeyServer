import { TermsPageSections } from "../../self/models/termsPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getTermsPageSectionsUser = async (req, res, next) => {
  try {
    const pageData = await TermsPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "Terms page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch terms page sections", next);
  }
};
