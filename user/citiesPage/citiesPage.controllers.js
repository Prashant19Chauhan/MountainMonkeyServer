import { CitiesPageSections } from "../../self/models/citiesPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getCitiesPageSectionsUser = async (req, res, next) => {
  try {
    const pageData = await CitiesPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "Cities page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch cities page sections", next);
  }
};
