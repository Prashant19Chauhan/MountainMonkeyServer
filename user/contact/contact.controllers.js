import ContactMessage from "../../self/models/contact.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return errorHandler(StatusCodes.BAD_REQUEST, "Name, email, and message are required fields", next);
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject: subject || "General Enquiry",
      message
    });

    return sendSuccess(res, StatusCodes.CREATED, "Your message has been sent successfully!", newMessage);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to submit contact message", next);
  }
};
