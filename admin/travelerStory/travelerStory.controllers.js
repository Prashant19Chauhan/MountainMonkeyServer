import TravelerStory from "../../self/models/travelerStory.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { adminActionSchema } from "../../user/travelerStory/travelerStory.validations.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllStories = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status) query.status = status;

        const stories = await TravelerStory.find(query)
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Stories fetched successfully", stories);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stories", next);
    }
};

// ── UPDATE STATUS ──────────────────────────────────────────────────────────

export const updateStoryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Story ID is required", next);
        }

        const result = adminActionSchema.safeParse(req.body);
        if (!result.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(result.error), next);
        }

        const story = await TravelerStory.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: result.data.status,
                    rejectionReason: result.data.rejectionReason || "",
                },
            },
            { new: true }
        );

        if (!story) {
            return errorHandler(StatusCodes.NOT_FOUND, "Story not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Story status updated successfully", story);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update story status", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteStoryAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Story ID is required", next);
        }

        const story = await TravelerStory.findByIdAndDelete(id);

        if (!story) {
            return errorHandler(StatusCodes.NOT_FOUND, "Story not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Story deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete story", next);
    }
};
