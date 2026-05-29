import EnquiryModel from "../../self/models/enquiry.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getAllEnquiries = async (req, res, next) => {
    try {
        const { enquiryType, status } = req.query;
        const adminId = req.user?._id;

        const query = { adminId };

        if (enquiryType) query.enquiryType = enquiryType;
        if (status) query.status = status;

        const enquiries = await EnquiryModel.find(query)
            .sort({ createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Enquiries fetched successfully", enquiries);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch enquiries", next);
    }
};

export const updateEnquiryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const adminId = req.user?._id;

        if (!status || !["Pending", "Reviewed", "Completed"].includes(status)) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Invalid or missing status value", next);
        }

        const updatedEnquiry = await EnquiryModel.findOneAndUpdate(
            { _id: id, adminId },
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedEnquiry) {
            return errorHandler(StatusCodes.NOT_FOUND, "Enquiry not found or unauthorized", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Enquiry status updated successfully", updatedEnquiry);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update enquiry status", next);
    }
};

export const deleteEnquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user?._id;

        const deletedEnquiry = await EnquiryModel.findOneAndDelete({ _id: id, adminId });

        if (!deletedEnquiry) {
            return errorHandler(StatusCodes.NOT_FOUND, "Enquiry not found or unauthorized", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Enquiry deleted successfully", deletedEnquiry);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete enquiry", next);
    }
};
