import { Location } from "../../self/models/locations.models.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createLocationSchema, deleteLocationSchema, updateLocationSchema } from "./locationsSchema.validations.js";
import { CityDetailSections } from "../../self/models/cityDetailSections.model.js";
import { generateSlug } from "../../self/utility/slug.utils.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createLocation = async (req, res, next) => {
    try {
        const validationResult = createLocationSchema.safeParse(req.body);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const data = { ...validationResult.data };
        if (!data.slug && data.name) {
            data.slug = generateSlug(data.name);
        }

        // Check if slug is unique
        const slugExists = await Location.findOne({ slug: data.slug });
        if (slugExists) {
            return errorHandler(StatusCodes.CONFLICT, `A location with the slug '${data.slug}' already exists. Please choose a unique name.`, next);
        }

        const location = await Location.create(data);

        return sendSuccess(res, StatusCodes.CREATED, "Location created successfully", location);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create location", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteLocation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = deleteLocationSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findByIdAndDelete(id);

        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "Location not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Location deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete location", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateLocation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = updateLocationSchema.safeParse(req.body);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const data = { ...validationResult.data };
        if (data.name && !data.slug) {
            data.slug = generateSlug(data.name);
        }

        if (data.slug) {
            const slugExists = await Location.findOne({ slug: data.slug, _id: { $ne: id } });
            if (slugExists) {
                return errorHandler(StatusCodes.CONFLICT, `A location with slug '${data.slug}' already exists. Please choose a unique name.`, next);
            }
        }

        const location = await Location.findByIdAndUpdate(id, data, { new: true });

        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "Location not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Location updated successfully", location);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update location", next);
    }
};

// ── GET ALL ────────────────────────────────────────────────────────────────

export const getAllLocations = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = search
             ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { country: { $regex: search, $options: "i" } },
                    { state: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const [locations, total] = await Promise.all([
            Location.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Location.countDocuments(filter),
        ]);

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Locations fetched successfully",
            locations,
            {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get locations", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getCityById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = deleteLocationSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findById(id);

        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "Location not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Location fetched successfully", location);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get location", next);
    }
};

// ── CITY DETAIL SECTIONS ──────────────────────────────────────────────────

export const getCityDetailSections = async (req, res, next) => {
    try {
        const { id } = req.params;

        const validationResult = deleteLocationSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findById(id);
        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "City location not found", next);
        }

        let sections = await CityDetailSections.findOne({ cityId: id });
        if (!sections) {
            sections = { cityId: id, customSections: [] };
        }

        return sendSuccess(res, StatusCodes.OK, "City detail sections fetched successfully", sections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get city detail sections", next);
    }
};

export const saveCityDetailSections = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { customSections } = req.body;

        const validationResult = deleteLocationSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const location = await Location.findById(id);
        if (!location) {
            return errorHandler(StatusCodes.NOT_FOUND, "City location not found", next);
        }

        let sections = await CityDetailSections.findOne({ cityId: id });
        if (sections) {
            sections.customSections = customSections || [];
            await sections.save();
        } else {
            sections = await CityDetailSections.create({
                cityId: id,
                customSections: customSections || []
            });
        }

        return sendSuccess(res, StatusCodes.OK, "City detail sections saved successfully", sections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to save city detail sections", next);
    }
};
