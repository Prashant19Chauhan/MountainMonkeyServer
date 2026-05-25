import TravelerStory from "../../self/models/travelerStory.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createStorySchema, updateStorySchema } from "./travelerStory.validations.js";

export const createStory = async (req, res, next) => {
    try {
        const result = createStorySchema.safeParse(req.body);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue?.path?.join(".") || "";
            return errorHandler(StatusCodes.BAD_REQUEST, `${field ? `'${field}': ` : ""}${issue?.message}`, next);
        }

        const story = new TravelerStory({ ...result.data, author: req.user.id, status: "pending" });
        const savedStory = await story.save();

        return sendSuccess(res, StatusCodes.CREATED, "Story submitted successfully", savedStory);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create story", next);
    }
};

export const getMyStories = async (req, res, next) => {
    try {
        const stories = await TravelerStory.find({ author: req.user.id }).sort({ createdAt: -1 });
        return sendSuccess(res, StatusCodes.OK, "Stories fetched successfully", stories);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch stories", next);
    }
};

export const updateStory = async (req, res, next) => {
    try {
        const result = updateStorySchema.safeParse(req.body);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue?.path?.join(".") || "";
            return errorHandler(StatusCodes.BAD_REQUEST, `${field ? `'${field}': ` : ""}${issue?.message}`, next);
        }

        const story = await TravelerStory.findOne({ _id: req.params.id, author: req.user.id });
        if (!story) return errorHandler(StatusCodes.NOT_FOUND, "Story not found or you don't have permission to update it", next);

        if (story.status !== "pending") {
            return errorHandler(StatusCodes.FORBIDDEN, "Cannot update a story that has already been reviewed by admin", next);
        }

        Object.assign(story, result.data);
        const updatedStory = await story.save();

        return sendSuccess(res, StatusCodes.OK, "Story updated successfully", updatedStory);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update story", next);
    }
};

export const deleteStory = async (req, res, next) => {
    try {
        const story = await TravelerStory.findOne({ _id: req.params.id, author: req.user.id });
        if (!story) return errorHandler(StatusCodes.NOT_FOUND, "Story not found or you don't have permission to delete it", next);

        if (story.status !== "pending") {
            return errorHandler(StatusCodes.FORBIDDEN, "Cannot delete a story that has already been reviewed by admin", next);
        }

        await story.deleteOne();
        return sendSuccess(res, StatusCodes.OK, "Story deleted successfully");
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete story", next);
    }
};
