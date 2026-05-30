import { FaqPageSections } from "../../../self/models/faqPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateFaqPageSectionsSchema } from "./faqPage.validations.js";

const getValidationMessage = (zodError) => {
  const issue = zodError.issues[0];
  const field = issue?.path?.join(".") || "";
  return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateFaqPageSections = async (req, res, next) => {
  try {
    const validate = updateFaqPageSectionsSchema.safeParse(req.body);
    if (!validate.success) {
      return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
    }

    const { sections } = validate.data;

    let pageData = await FaqPageSections.findOne();

    if (!pageData) {
      pageData = new FaqPageSections({ sections });
      await pageData.save();
    } else {
      pageData.sections = sections;
      await pageData.save();
    }

    return sendSuccess(res, StatusCodes.OK, "FAQ page content saved successfully", pageData);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update FAQ page sections", next);
  }
};

export const getFaqPageSections = async (req, res, next) => {
  try {
    const pageData = await FaqPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "FAQ page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch FAQ page sections", next);
  }
};
