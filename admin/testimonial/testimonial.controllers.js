import Testimonial from "../../self/models/testimonial.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { adminTestimonialActionSchema } from "../../user/testimonial/testimonial.validations.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllTestimonials = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status) query.status = status;

        const testimonials = await Testimonial.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Testimonials fetched successfully", testimonials);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch testimonials", next);
    }
};

// ── UPDATE STATUS ──────────────────────────────────────────────────────────

export const updateTestimonialStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Testimonial ID is required", next);
        }

        const result = adminTestimonialActionSchema.safeParse(req.body);
        if (!result.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(result.error), next);
        }

        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            { $set: result.data },
            { new: true }
        );

        if (!testimonial) {
            return errorHandler(StatusCodes.NOT_FOUND, "Testimonial not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Testimonial status updated successfully", testimonial);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update testimonial status", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteTestimonialAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Testimonial ID is required", next);
        }

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return errorHandler(StatusCodes.NOT_FOUND, "Testimonial not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Testimonial deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete testimonial", next);
    }
};
