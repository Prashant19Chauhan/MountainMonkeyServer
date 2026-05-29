import EnquiryModel from "../../self/models/enquiry.model.js";
import StayModel from "../../self/models/stay.model.js";
import PackagesModel from "../../self/models/package.model.js";
import ActivityModel from "../../self/models/activity.model.js";
import DestinationModel from "../../self/models/destination.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const createEnquiry = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            enquiryType,
            itemId,
            itemTitle,
            checkInDate,
            checkOutDate,
            numberOfGuests,
            roomType,
            message
        } = req.body;

        // Basic validations
        if (!name || !email || !phone || !enquiryType || !itemId || !itemTitle || !message) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Required fields are missing", next);
        }

        // 1. Fetch the product to identify its admin owner
        let product = null;
        if (enquiryType === "stay") {
            product = await StayModel.findById(itemId);
        } else if (enquiryType === "package") {
            product = await PackagesModel.findById(itemId);
        } else if (enquiryType === "activity") {
            product = await ActivityModel.findById(itemId);
        } else if (enquiryType === "destination") {
            product = await DestinationModel.findById(itemId);
        }

        if (!product) {
            return errorHandler(StatusCodes.NOT_FOUND, `The associated ${enquiryType} item was not found.`, next);
        }

        const adminId = product.adminId;
        if (!adminId) {
            return errorHandler(StatusCodes.BAD_REQUEST, `The associated ${enquiryType} does not have an admin owner assigned.`, next);
        }

        const enquiryData = {
            userId: req.user ? (req.user.id || req.user._id) : null,
            adminId,
            name,
            email,
            phone,
            enquiryType,
            itemId,
            itemTitle,
            checkInDate: checkInDate ? new Date(checkInDate) : null,
            checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
            numberOfGuests: numberOfGuests ? Number(numberOfGuests) : null,
            roomType,
            message
        };

        const newEnquiry = await EnquiryModel.create(enquiryData);

        return sendSuccess(res, StatusCodes.CREATED, "Enquiry submitted successfully", newEnquiry);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to submit enquiry", next);
    }
};
