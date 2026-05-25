import Testimonial from "../../self/models/testimonial.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createTestimonialSchema } from "./testimonial.validations.js";

export const createTestimonial = async (req, res, next) => {
    try {
        const result = createTestimonialSchema.safeParse(req.body);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue?.path?.join(".") || "";
            return errorHandler(StatusCodes.BAD_REQUEST, `${field ? `'${field}': ` : ""}${issue?.message}`, next);
        }

        const testimonial = new Testimonial({ ...result.data, user: req.user.id, status: "pending" });
        const savedTestimonial = await testimonial.save();

        return sendSuccess(res, StatusCodes.CREATED, "Testimonial submitted successfully", savedTestimonial);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create testimonial", next);
    }
};

export const getMyTestimonials = async (req, res, next) => {
    try {
        const testimonials = await Testimonial.find({ user: req.user.id }).sort({ createdAt: -1 });
        return sendSuccess(res, StatusCodes.OK, "Testimonials fetched successfully", testimonials);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch testimonials", next);
    }
};

export const deleteMyTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findOne({ _id: req.params.id, user: req.user.id });
        if (!testimonial) return errorHandler(StatusCodes.NOT_FOUND, "Testimonial not found or you don't have permission to delete it", next);

        if (testimonial.status !== "pending") {
            return errorHandler(StatusCodes.FORBIDDEN, "Cannot delete a testimonial that has already been reviewed by admin", next);
        }

        await testimonial.deleteOne();
        return sendSuccess(res, StatusCodes.OK, "Testimonial deleted successfully");
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete testimonial", next);
    }
};
