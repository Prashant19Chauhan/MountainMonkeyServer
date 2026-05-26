import PackageModel from "../../self/models/package.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { generateSlug } from "../../self/utility/slug.utils.js";
import { createPackageSchema } from "./packageSchema.validation.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE PACKAGE ─────────────────────────────────────────────────────────

export const createPackage = async (req, res, next) => {
    try {
        const data = req.body;
        const adminId = req.user?._id;

        const validatedData = createPackageSchema.safeParse(data);
        if (!validatedData.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validatedData.error), next);
        }

        const validData = validatedData.data;

        // Prevent duplicate package for the same destination
        const existing = await PackageModel.findOne({
            title: validData.title,
            "destination.id": validData.destination.id,
            adminId,
        });

        if (existing) {
            return errorHandler(StatusCodes.CONFLICT, "A package with this title already exists for the selected destination", next);
        }

        const slug = generateSlug(validData.title);

        // Enforce slug uniqueness
        const slugExists = await PackageModel.findOne({ slug });
        if (slugExists) {
            return errorHandler(StatusCodes.CONFLICT, `A package with the slug '${slug}' already exists. Please use a different title.`, next);
        }

        const newPackage = new PackageModel({ ...validData, adminId, slug });
        await newPackage.save();

        return sendSuccess(res, StatusCodes.CREATED, "Package created successfully", newPackage);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create package", next);
    }
};

// ── UPDATE PACKAGE ─────────────────────────────────────────────────────────

export const updatePackage = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const data = req.body;
        const adminId = req.user?._id;

        if (!slug) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Package slug is required", next);
        }

        const validatedData = createPackageSchema.partial().safeParse(data);
        if (!validatedData.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validatedData.error), next);
        }

        const validData = validatedData.data;

        const existingPackage = await PackageModel.findOne({ slug, adminId });
        if (!existingPackage) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found or you do not have permission to update it", next);
        }

        if (validData.title && validData.title !== existingPackage.title) {
            const newSlug = generateSlug(validData.title);
            const slugExists = await PackageModel.findOne({ slug: newSlug, _id: { $ne: existingPackage._id } });
            if (slugExists) {
                return errorHandler(StatusCodes.CONFLICT, `A package with the slug '${newSlug}' already exists. Please use a different title.`, next);
            }
            validData.slug = newSlug;
        }

        Object.assign(existingPackage, { ...validData, updatedAt: new Date() });
        await existingPackage.save();

        return sendSuccess(res, StatusCodes.OK, "Package updated successfully", existingPackage);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update package", next);
    }
};

// ── GET ALL PACKAGES ───────────────────────────────────────────────────────

export const getPackages = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        let { page = 1, limit = 10, destinationId, category, minPrice, maxPrice, status } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = {};

        if (destinationId) filter["destination.id"] = destinationId;
        if (category) filter.categories = category;
        if (status) filter.status = status;
        if (minPrice || maxPrice) {
            filter["pricing.basePrice"] = {
                $gte: Number(minPrice || 0),
                $lte: Number(maxPrice || 1000000),
            };
        }

        const [packages, total] = await Promise.all([
            PackageModel.find({ adminId, ...filter })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ "aiMetadata.popularityScore": -1 })
                .populate([{ path: "destination.id", select: "name" }]),
            PackageModel.countDocuments({ adminId, ...filter }),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Packages fetched successfully",
            packages,
            {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get packages", next);
    }
};

// ── GET SINGLE PACKAGE ─────────────────────────────────────────────────────

export const getPackage = async (req, res, next) => {
    try {
        const adminId = req.user?._id;
        const { slug } = req.params;

        if (!slug) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Package slug is required", next);
        }

        const pkg = await PackageModel.findOne({ adminId, slug }).populate([
            { path: "destination.id", select: "-aiMetadata.embedding" },
            { path: "accommodations.stayId", select: "-embedding" },
            { path: "activities.id", select: "-embedding" },
        ]);

        if (!pkg) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found", next);
        }

        // Increment view count
        pkg.analytics.views += 1;
        await pkg.save();

        return sendSuccess(res, StatusCodes.OK, "Package fetched successfully", pkg);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get package", next);
    }
};

// ── DELETE PACKAGE ─────────────────────────────────────────────────────────

export const deletePackage = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const adminId = req.user?._id;

        if (!slug) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Package slug is required", next);
        }

        const deleted = await PackageModel.findOneAndDelete({ adminId, slug });

        if (!deleted) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found or you do not have permission to delete it", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Package deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete package", next);
    }
};

export const updatePackageCurrentPrice = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { currentPrice } = req.body;
        const adminId = req.user?._id;

        if (!slug) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Package slug is required", next);
        }

        if (currentPrice === undefined || isNaN(Number(currentPrice))) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Valid current price is required", next);
        }

        const pkg = await PackageModel.findOneAndUpdate(
            { slug, adminId },
            { currentPrice: Number(currentPrice) },
            { new: true, runValidators: true }
        );

        if (!pkg) {
            return errorHandler(StatusCodes.NOT_FOUND, "Package not found or you do not have permission to update it", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Package current price updated successfully", pkg);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update current price", next);
    }
};