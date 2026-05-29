import { DestinationDetailSections } from "../../self/models/destinationDetailSections.model.js";
import Destination from "../../self/models/destination.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { updateDestinationDetailSectionsSchema } from "./destinationDetailSections.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// GET sections for a specific destination (by slug)
export const getDestinationDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const destination = await Destination.findOne({ slug }).select("_id");
        if (!destination) {
            return errorHandler(StatusCodes.NOT_FOUND, "Destination not found", next);
        }
        const sections = await DestinationDetailSections.findOne({ destinationId: destination._id });
        return sendSuccess(res, StatusCodes.OK, "Destination detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch destination detail sections", next);
    }
};

// POST/update sections for a specific destination (by slug)
export const updateDestinationDetailSections = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const destination = await Destination.findOne({ slug }).select("_id");
        if (!destination) {
            return errorHandler(StatusCodes.NOT_FOUND, "Destination not found", next);
        }

        const validate = updateDestinationDetailSectionsSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const { customSections } = validate.data;

        let detailSections = await DestinationDetailSections.findOne({ destinationId: destination._id });

        if (!detailSections) {
            detailSections = new DestinationDetailSections({ destinationId: destination._id, customSections });
            await detailSections.save();
        } else {
            detailSections.customSections = customSections;
            await detailSections.save();
        }

        return sendSuccess(res, StatusCodes.OK, "Destination detail sections updated successfully", detailSections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update destination detail sections", next);
    }
};
