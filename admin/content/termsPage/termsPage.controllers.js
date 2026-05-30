import { TermsPageSections } from "../../../self/models/termsPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updateTermsPageSectionsSchema } from "./termsPage.validations.js";

const getValidationMessage = (zodError) => {
  const issue = zodError.issues[0];
  const field = issue?.path?.join(".") || "";
  return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updateTermsPageSections = async (req, res, next) => {
  try {
    const validate = updateTermsPageSectionsSchema.safeParse(req.body);
    if (!validate.success) {
      return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
    }

    const { sections } = validate.data;

    let pageData = await TermsPageSections.findOne();

    if (!pageData) {
      pageData = new TermsPageSections({ sections });
      await pageData.save();
    } else {
      pageData.sections = sections;
      await pageData.save();
    }

    return sendSuccess(res, StatusCodes.OK, "Terms page content saved successfully", pageData);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update terms page sections", next);
  }
};

export const getTermsPageSections = async (req, res, next) => {
  try {
    const pageData = await TermsPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "Terms page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch terms page sections", next);
  }
};
