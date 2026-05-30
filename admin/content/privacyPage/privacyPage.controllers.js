import { PrivacyPageSections } from "../../../self/models/privacyPage.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { updatePrivacyPageSectionsSchema } from "./privacyPage.validations.js";

const getValidationMessage = (zodError) => {
  const issue = zodError.issues[0];
  const field = issue?.path?.join(".") || "";
  return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const updatePrivacyPageSections = async (req, res, next) => {
  try {
    const validate = updatePrivacyPageSectionsSchema.safeParse(req.body);
    if (!validate.success) {
      return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
    }

    const { sections } = validate.data;

    let pageData = await PrivacyPageSections.findOne();

    if (!pageData) {
      pageData = new PrivacyPageSections({ sections });
      await pageData.save();
    } else {
      pageData.sections = sections;
      await pageData.save();
    }

    return sendSuccess(res, StatusCodes.OK, "Privacy page content saved successfully", pageData);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update privacy page sections", next);
  }
};

export const getPrivacyPageSections = async (req, res, next) => {
  try {
    const pageData = await PrivacyPageSections.findOne();
    return sendSuccess(res, StatusCodes.OK, "Privacy page sections fetched successfully", pageData || null);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch privacy page sections", next);
  }
};
