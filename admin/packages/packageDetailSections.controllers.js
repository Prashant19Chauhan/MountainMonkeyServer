import { PackageDetailSections } from "../../self/models/packageDetailSections.model.js";
import PackageModel from "../../self/models/package.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { updatePackageDetailSectionsSchema } from "./packageDetailSections.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// GET sections for a specific package (by slug)
export const getPackageDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const pkg = await PackageModel.findOne({ slug }).select("_id");
        if (!pkg) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found", next);
        }
        const sections = await PackageDetailSections.findOne({ packageId: pkg._id });
        return sendSuccess(res, StatusCodes.OK, "Package detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch package detail sections", next);
    }
};

// POST/update sections for a specific package (by slug)
export const updatePackageDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const pkg = await PackageModel.findOne({ slug }).select("_id");
        if (!pkg) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found", next);
        }

        const validate = updatePackageDetailSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let detailSections = await PackageDetailSections.findOne({ packageId: pkg._id });

        if (!detailSections) {
            detailSections = new PackageDetailSections({ packageId: pkg._id, customSections });
            await detailSections.save();
        } else {
            detailSections.customSections = customSections;
            await detailSections.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Package detail sections updated successfully", detailSections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update package detail sections", next);
    }
};
