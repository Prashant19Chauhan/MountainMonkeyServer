import { MetaData } from "../../self/models/metaData.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { seoValidationSchema } from "./metaData.validations.js";
import DestinationModel from "../../self/models/destination.model.js";
import ActivityModel from "../../self/models/activity.model.js";
import PackageModel from "../../self/models/package.model.js";
import StayModel from "../../self/models/stay.model.js";
import RouteModel from "../../self/models/travelRoute.model.js";
import {Location} from "../../self/models/locations.models.js";
import LocalInfoModel from "../../self/models/localInfo.model.js";


// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE ─────────────────────────────────────────────────────────────────

export const createMetaData = async (req, res, next) => {
    try {
        const data = req.body;
        const adminId = req.user._id;
        const { pageId, typeOfPage } = req.params;

        if (!pageId || !typeOfPage) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Page ID and Type of page is required", next);
        }

        data.pageId = pageId;

        const validate = seoValidationSchema.safeParse(data);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        validate.data.adminId = adminId;

        const metaData = await MetaData.create(validate.data);

        if (typeOfPage == "destination") {
            const destination = await DestinationModel.findById(pageId);
            if (!destination) {
                return errorHandler(StatusCodes.NOT_FOUND, "Destination not found", next);
            }
            destination.metaDataId = metaData._id;
            await destination.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", destination);
        }

        if (typeOfPage == "activity") {
            const activity = await ActivityModel.findById(pageId);
            if (!activity) {
                return errorHandler(StatusCodes.NOT_FOUND, "Activity not found", next);
            }
            activity.metaDataId = metaData._id;
            await activity.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", activity);
        }

        else if (typeOfPage == "package") {
            const packageData = await PackageModel.findById(pageId);
            if (!packageData) {
                return errorHandler(StatusCodes.NOT_FOUND, "Package not found", next);
            }
            packageData.metaDataId = metaData._id;
            await packageData.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", packageData);
        }

        else if (typeOfPage == "stay") {
            const stayData = await StayModel.findById(pageId);
            if (!stayData) {
                return errorHandler(StatusCodes.NOT_FOUND, "Stay not found", next);
            }
            stayData.metaDataId = metaData._id;
            await stayData.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", stayData);
        }

        else if(typeOfPage == "route") {
            const routeData = await RouteModel.findById(pageId);
            if (!routeData) {
                return errorHandler(StatusCodes.NOT_FOUND, "Route not found", next);
            }
            routeData.metaDataId = metaData._id;
            await routeData.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", routeData);
        }

        else if(typeOfPage == "city") {
            const cityData = await Location.findById(pageId);
            if (!cityData) {
                return errorHandler(StatusCodes.NOT_FOUND, "City not found", next);
            }
            cityData.metaDataId = metaData._id;
            await cityData.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", cityData);
        }

        else if(typeOfPage == "local-info") {
            const localInfoData = await LocalInfoModel.findById(pageId);
            if (!localInfoData) {
                return errorHandler(StatusCodes.NOT_FOUND, "Local info not found", next);
            }
            localInfoData.metaDataId = metaData._id;
            await localInfoData.save();
            return sendSuccess(res, StatusCodes.OK, "Meta data created successfully", localInfoData);
        }

        return sendSuccess(res, StatusCodes.CREATED, "Meta data created successfully", metaData);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create meta data", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getSingleMetaData = async (req, res, next) => {
    try {
        const { pageId } = req.params;
        const adminId = req.user._id;

        if (!pageId) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Page ID is required", next);
        }

        const metaData = await MetaData.findOne({ pageId, adminId });

        if (!metaData) {
            return errorHandler(StatusCodes.NOT_FOUND, "Meta data not found for this page", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Meta data fetched successfully", metaData);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch meta data", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateMetaData = async (req, res, next) => {
    try {
        const { pageId } = req.params;
        const adminId = req.user._id;
        const data = req.body;

        if (!pageId) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Page ID is required", next);
        }

        const validate = seoValidationSchema.partial().safeParse(data);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const updatedMetaData = await MetaData.findOneAndUpdate(
            { pageId, adminId },
            { ...validate.data },
            { new: true, runValidators: true }
        );

        if (!updatedMetaData) {
            return errorHandler(StatusCodes.NOT_FOUND, "Meta data not found for this page", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Meta data updated successfully", updatedMetaData);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update meta data", next);
    }
};