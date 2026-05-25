import { HomePageSections } from "../../self/models/home.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import PackagesModel from "../../self/models/package.model.js";
import DestinationModel from "../../self/models/destination.model.js";
import ActivityModel from "../../self/models/activity.model.js";
import StayModel from "../../self/models/stay.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import TravelerStory from "../../self/models/travelerStory.model.js";
import Testimonial from "../../self/models/testimonial.model.js";

export const homeHeroSection = async (req, res, next) => {
    try {
        const heroSectionContent = await HomePageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Hero section fetched successfully", heroSectionContent || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch hero section", next);
    }
}

export const homeCuratedPackages = async (req, res, next) => {
    try {
        const curatedPackages = await PackagesModel.find({ status: "active", isFeatured: true })
            .limit(10)
            .sort({ createdAt: -1 })
            .select("title slug duration pricing.basePrice categories images")
            .populate("destination.id", "name -_id");

        return sendSuccess(res, StatusCodes.OK, "Curated packages fetched successfully", curatedPackages);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch curated packages", next);
    }
}

export const homeTopDestinations = async (req, res, next) => {
    try {
        const topDestinations = await DestinationModel.find({ status: "Active" })
            .limit(10)
            .sort({ "analytics.bookings": -1 })
            .select("name slug images shortDescription location.address");

        return sendSuccess(res, StatusCodes.OK, "Top destinations fetched successfully", topDestinations);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch top destinations", next);
    }
}

export const homePopularActivities = async (req, res, next) => {
    try {
        const popularActivities = await ActivityModel.find({ isActive: true })
            .limit(10)
            .sort({ popularityScore: -1 })
            .select("name shortDescription images pricing ratings location.address");

        return sendSuccess(res, StatusCodes.OK, "Popular activities fetched successfully", popularActivities);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch popular activities", next);
    }
}

export const homeUniqueStays = async (req, res, next) => {
    try {
        const uniqueStays = await StayModel.find({ isActive: true })
            .limit(10)
            .sort({ popularityScore: -1 })
            .select("name shortDescription images priceRange ratings starRating location.address");

        return sendSuccess(res, StatusCodes.OK, "Unique stays fetched successfully", uniqueStays);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch unique stays", next);
    }
}

export const homeUpcomingPackages = async (req, res, next) => {
    try {
        const upcomingPackages = await PackagesModel.find({
            status: "active",
            "availability.startDate": { $gt: new Date() }
        })
            .limit(10)
            .sort({ "availability.startDate": 1 })
            .select("title slug images pricing availability duration destination");

        return sendSuccess(res, StatusCodes.OK, "Upcoming packages fetched successfully", upcomingPackages);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch upcoming packages", next);
    }
}

export const homeAdvertisements = async (req, res, next) => {
    try {
        const { placement } = req.query;
        const query = { status: "active" };
        if (placement) query.placement = placement;

        const advertisements = await Advertisement.find(query).sort({ priority: -1, createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Advertisements fetched successfully", advertisements);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch advertisements", next);
    }
}

export const homeTravelerStories = async (req, res, next) => {
    try {
        const stories = await TravelerStory.find({ status: "approved" })
            .limit(8)
            .sort({ createdAt: -1 })
            .select("title content images location author createdAt")
            .populate("author", "name");

        return sendSuccess(res, StatusCodes.OK, "Traveler stories fetched successfully", stories);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch traveler stories", next);
    }
}

export const homeTestimonials = async (req, res, next) => {
    try {
        const testimonials = await Testimonial.find({ status: "approved" })
            .limit(10)
            .sort({ isFeatured: -1, createdAt: -1 })
            .populate("user", "name");

        return sendSuccess(res, StatusCodes.OK, "Testimonials fetched successfully", testimonials);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch testimonials", next);
    }
}


