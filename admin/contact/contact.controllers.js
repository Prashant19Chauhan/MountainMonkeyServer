import ContactMessage from "../../self/models/contact.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getContactMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, StatusCodes.OK, "Contact messages fetched successfully", messages);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch contact messages", next);
  }
};

export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Reviewed", "Completed"].includes(status)) {
      return errorHandler(StatusCodes.BAD_REQUEST, "Invalid or missing status value", next);
    }

    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return errorHandler(StatusCodes.NOT_FOUND, "Contact message not found", next);
    }

    return sendSuccess(res, StatusCodes.OK, "Status updated successfully", updatedMessage);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update contact message status", next);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMessage = await ContactMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return errorHandler(StatusCodes.NOT_FOUND, "Contact message not found", next);
    }

    return sendSuccess(res, StatusCodes.OK, "Contact message deleted successfully", deletedMessage);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete contact message", next);
  }
};
