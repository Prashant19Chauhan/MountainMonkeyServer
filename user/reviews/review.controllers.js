import Review from "../../self/models/review.model.js";
import PackagesModel from "../../self/models/package.model.js";
import ActivityModel from "../../self/models/activity.model.js";
import DestinationModel from "../../self/models/destination.model.js";
import StayModel from "../../self/models/stay.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { z } from "zod";

const reviewSchema = z.object({
    itemId: z.string().optional(),
    itemType: z.enum(["package", "destination", "activity", "stay"]),
    itemTitle: z.string().optional(),
    itemSlug: z.string().optional(),
    rating: z.number().min(1).max(5),
    reviewText: z.string().min(10, "Review text must be at least 10 characters"),
});

// Lookup item to verify it exists
const findItem = async (itemType, itemId, itemSlug) => {
    const query = {};
    if (itemId) {
        query._id = itemId;
    } else if (itemSlug) {
        query.slug = itemSlug;
    } else {
        return null;
    }

    switch (itemType) {
        case "package": return PackagesModel.findOne(query);
        case "activity": return ActivityModel.findOne(query);
        case "destination": return DestinationModel.findOne(query);
        case "stay": return StayModel.findOne(query);
        default: return null;
    }
};

export const createOrUpdateReview = async (req, res, next) => {
    try {
        const result = reviewSchema.safeParse(req.body);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue?.path?.join(".") || "";
            return errorHandler(StatusCodes.BAD_REQUEST, `${field ? `'${field}': ` : ""}${issue?.message}`, next);
        }

        const { itemId: reqItemId, itemType, itemTitle: reqItemTitle, itemSlug, rating, reviewText } = result.data;
        const userId = req.user.id;

        // Verify item exists
        const item = await findItem(itemType, reqItemId, itemSlug);
        if (!item) {
            return errorHandler(StatusCodes.NOT_FOUND, `The specified ${itemType} was not found.`, next);
        }

        const itemId = item._id;
        const itemTitle = item.title || item.name || reqItemTitle || "Product";

        // Upsert: one review per user per item
        const review = await Review.findOneAndUpdate(
            { userId, itemId },
            { userId, itemId, itemType, itemTitle, rating, reviewText, status: "pending" },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return sendSuccess(res, StatusCodes.OK, "Review submitted successfully", review);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to submit review", next);
    }
};

export const getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return sendSuccess(res, StatusCodes.OK, "Reviews fetched successfully", reviews);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch reviews", next);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({ _id: req.params.id, userId: req.user.id });
        if (!review) return errorHandler(StatusCodes.NOT_FOUND, "Review not found or you don't have permission to delete it", next);

        if (review.status !== "pending") {
            return errorHandler(StatusCodes.FORBIDDEN, "Cannot delete a review that has already been reviewed by admin", next);
        }

        await review.deleteOne();
        return sendSuccess(res, StatusCodes.OK, "Review deleted successfully");
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete review", next);
    }
};
