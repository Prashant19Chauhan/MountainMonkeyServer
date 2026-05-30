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

        const existingStory = await TravelerStory.findById(id);
        if (!existingStory) {
            return errorHandler(StatusCodes.NOT_FOUND, "Story not found", next);
        }

        const status = result.data.status;
        const slug = result.data.slug ? result.data.slug.toLowerCase().trim() : existingStory.slug;

        // If approving, check for duplicate approved slug
        if (status === "approved") {
            if (!slug) {
                return errorHandler(StatusCodes.BAD_REQUEST, "A valid slug is required to approve the story", next);
            }

            const slugClash = await TravelerStory.findOne({
                slug: slug,
                status: "approved",
                _id: { $ne: id }
            });

            if (slugClash) {
                return errorHandler(
                    StatusCodes.BAD_REQUEST,
                    `Cannot approve story: The slug "${slug}" is already in use by another approved story "${slugClash.title}".`,
                    next
                );
            }
        }

        existingStory.status = status;
        existingStory.rejectionReason = result.data.rejectionReason || "";
        if (result.data.slug) {
            existingStory.slug = slug;
        }
        if (result.data.metaData) {
            existingStory.metaData = {
                title: result.data.metaData.title !== undefined ? result.data.metaData.title : existingStory.metaData?.title || "",
                description: result.data.metaData.description !== undefined ? result.data.metaData.description : existingStory.metaData?.description || "",
                keywords: result.data.metaData.keywords !== undefined ? result.data.metaData.keywords : existingStory.metaData?.keywords || "",
            };
        }

        const updatedStory = await existingStory.save();

        return sendSuccess(res, StatusCodes.OK, "Story status updated successfully", updatedStory);

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

export const checkSlugAvailability = async (req, res, next) => {
    try {
        const { slug, excludeId } = req.query;
        if (!slug) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Slug is required", next);
        }

        const query = { slug: slug.toLowerCase().trim(), status: "approved" };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const clashingStory = await TravelerStory.findOne(query);
        if (clashingStory) {
            return sendSuccess(res, StatusCodes.OK, "Slug clash check completed", {
                available: false,
                clashingStory: {
                    title: clashingStory.title
                }
            });
        }

        return sendSuccess(res, StatusCodes.OK, "Slug clash check completed", {
            available: true
        });
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to check slug availability", next);
    }
};
