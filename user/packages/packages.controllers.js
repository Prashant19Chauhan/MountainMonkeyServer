import PackageModel from "../../self/models/package.model.js";
import Advertisement from "../../self/models/advertisement.model.js";
import { PackagesPageSections } from "../../self/models/packagesPage.model.js";
import { PackageDetailSections } from "../../self/models/packageDetailSections.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

// Fetch featured/top packages (with fallback to top-rated if none featured)
export const getFeaturedPackages = async (req, res, next) => {
    try {
        let packages = await PackageModel.find({ status: "active", isFeatured: true })
            .select("title slug description shortDescription images pricing ratings duration transport destination categories aiMetadata")
            .populate("destination.id", "name location.address")
            .sort({ "analytics.bookings": -1, createdAt: -1 })
            .limit(3);

        // Fallback: return top packages if no featured ones exist
        if (!packages || packages.length === 0) {
            packages = await PackageModel.find({ status: "active" })
                .select("title slug description shortDescription images pricing ratings duration transport destination categories aiMetadata")
                .populate("destination.id", "name location.address")
                .sort({ "ratings.average": -1, "analytics.bookings": -1 })
                .limit(3);
        }

        return sendSuccess(res, StatusCodes.OK, "Featured packages fetched successfully", packages);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch featured packages", next);
    }
};

// Fetch tropical packages (for Tropical Paradises section)
export const getTropicalPackages = async (req, res, next) => {
    try {
        const tropicalRegex = /beach|island|tropical|coastal/i;

        const packages = await PackageModel.find({
            status: "active",
            $or: [
                { categories: { $regex: tropicalRegex } },
                { "aiMetadata.tags": { $regex: tropicalRegex } },
                { "aiMetadata.mood": { $regex: tropicalRegex } },
            ],
        })
        .select("title slug images pricing ratings duration destination")
        .populate("destination.id", "name location.address")
        .limit(8);

        return sendSuccess(res, StatusCodes.OK, "Tropical packages fetched successfully", packages);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch tropical packages", next);
    }
};

// Fetch popular packages
export const getPopularPackages = async (req, res, next) => {
    try {
        const packages = await PackageModel.find({ status: "active" })
            .select("title slug images pricing ratings duration destination aiMetadata shortDescription")
            .populate("destination.id", "name location.address")
            .sort({ "analytics.bookings": -1, "analytics.views": -1 })
            .limit(4);

        return sendSuccess(res, StatusCodes.OK, "Popular packages fetched successfully", packages);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch popular packages", next);
    }
};

// Fetch advertisements for packages page
export const getPackageAdvertisements = async (req, res, next) => {
    try {
        const { placement } = req.query;
        const query = { status: "active" };
        if (placement) query.placement = placement;

        const advertisements = await Advertisement.find(query).sort({ priority: -1, createdAt: -1 });

        return sendSuccess(res, StatusCodes.OK, "Advertisements fetched successfully", advertisements);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch advertisements", next);
    }
};

// Fetch all active packages
export const getAllPackages = async (req, res, next) => {
    try {
        const packages = await PackageModel.find({ status: "active" })
            .select("title slug description shortDescription images pricing ratings duration transport destination categories aiMetadata")
            .populate("destination.id", "name location.address");

        return sendSuccess(res, StatusCodes.OK, "All packages fetched successfully", packages);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch all packages", next);
    }
};

export const getPackagesPageSections = async (req, res, next) => {
    try {
        const sectionsContent = await PackagesPageSections.findOne();
        return sendSuccess(res, StatusCodes.OK, "Packages page sections fetched successfully", sectionsContent || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch packages page sections", next);
    }
};

// Fetch per-package custom content sections for UserApp (by slug)
export const getPackageDetailSectionsUser = async (req, res, next) => {
    try {
        const { packageSlug } = req.params;
        const pkg = await PackageModel.findOne({ slug: packageSlug }).select("_id");
        if (!pkg) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found", next);
        }
        const sections = await PackageDetailSections.findOne({ packageId: pkg._id });
        return sendSuccess(res, StatusCodes.OK, "Package detail sections fetched successfully", sections || null);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch package detail sections", next);
    }
};
