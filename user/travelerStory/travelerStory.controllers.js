import TravelerStory from "../../self/models/travelerStory.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createStorySchema, updateStorySchema } from "./travelerStory.validations.js";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export const createStory = async (req, res, next) => {
    try {
        const result = createStorySchema.safeParse(req.body);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue?.path?.join(".") || "";
            return errorHandler(StatusCodes.BAD_REQUEST, `${field ? `'${field}': ` : ""}${issue?.message}`, next);
        }

        const title = result.data.title;
        const slug = generateSlug(title);
        const shortDesc = result.data.shortDescription || "";
        const contentSnippet = result.data.content ? result.data.content.substring(0, 150) + (result.data.content.length > 150 ? "..." : "") : "";
        const metaData = {
            title: title,
            description: shortDesc || contentSnippet,
            keywords: (result.data.tags && result.data.tags.length > 0) ? result.data.tags.join(", ") : (result.data.location ? `travel, adventure, ${result.data.location}` : "travel, adventure")
        };

        const story = new TravelerStory({ 
            ...result.data, 
            author: req.user.id, 
            status: "pending",
            slug,
            metaData
        });
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

        // Update slug and metadata if fields modified
        if (result.data.title) {
            story.slug = generateSlug(result.data.title);
            story.metaData = {
                title: result.data.title,
                description: result.data.shortDescription || (result.data.content ? result.data.content.substring(0, 150) : story.metaData?.description || ""),
                keywords: (result.data.tags && result.data.tags.length > 0) ? result.data.tags.join(", ") : (result.data.location ? `travel, adventure, ${result.data.location}` : story.metaData?.keywords || "")
            };
        } else {
            const currentTitle = story.title;
            const currentShortDesc = result.data.shortDescription !== undefined ? result.data.shortDescription : story.shortDescription;
            const currentContent = result.data.content !== undefined ? result.data.content : story.content;
            const currentTags = result.data.tags !== undefined ? result.data.tags : story.tags;
            const currentLocation = result.data.location !== undefined ? result.data.location : story.location;

            const contentSnippet = currentContent ? currentContent.substring(0, 150) + (currentContent.length > 150 ? "..." : "") : "";

            story.metaData = {
                title: currentTitle,
                description: currentShortDesc || contentSnippet,
                keywords: (currentTags && currentTags.length > 0) ? currentTags.join(", ") : (currentLocation ? `travel, adventure, ${currentLocation}` : "travel, adventure")
            };
        }

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

export const getApprovedStoriesPublic = async (req, res, next) => {
    try {
        const stories = await TravelerStory.find({ status: "approved" })
            .sort({ createdAt: -1 })
            .populate("author", "name");
        return sendSuccess(res, StatusCodes.OK, "Approved stories fetched successfully", stories);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch approved stories", next);
    }
};

export const getApprovedStoryByIdPublic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = { status: "approved" };

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query.$or = [{ _id: id }, { slug: id }];
        } else {
            query.slug = id;
        }

        const story = await TravelerStory.findOne(query)
            .populate("author", "name");
        if (!story) return errorHandler(StatusCodes.NOT_FOUND, "Story not found", next);
        return sendSuccess(res, StatusCodes.OK, "Story fetched successfully", story);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch story", next);
    }
};
