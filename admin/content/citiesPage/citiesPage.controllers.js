import { CitiesPageSections } from "../../../self/models/citiesPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateCitiesPageSectionsSchema } from "./citiesPage.validations.js";

const getValidationMessage = (zodError) => {
  const issue = zodError.issues[0];
  const field = issue?.path?.join(".") || "";
  return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateCitiesPageSections = async (req, res, next) => {
  try {
    const validate = updateCitiesPageSectionsSchema.safeParse(req.body);
    if (!validate.success) {
      return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
    }

    const { title, description, sections } = validate.data;

    let pageData = await CitiesPageSections.findOne();

    if (!pageData) {
      pageData = new CitiesPageSections({ title, description, sections });
      await pageData.save();
    } else {
      pageData.title = title;
      pageData.description = description;
      pageData.sections = sections;
      await pageData.save();
    }

    return sendSuccess(res, StatusCodes.OK, "Cities page content saved successfully", pageData);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update cities page sections", next);
  }
};

export const getCitiesPageSections = async (req, res, next) => {
  try {
    const pageData = await CitiesPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "Cities page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch cities page sections", next);
  }
};
