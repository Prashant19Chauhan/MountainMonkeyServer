import mongoose from "mongoose";
import { Location } from "../../self/models/locations.models.js";
import Stay from "../../self/models/stay.model.js";
import Activity from "../../self/models/activity.model.js";
import Destination from "../../self/models/destination.model.js";
import Package from "../../self/models/package.model.js";
import { CityDetailSections } from "../../self/models/cityDetailSections.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

export const getActiveLocationsUser = async (req, res, next) => {
  try {
    const locations = await Location.find({ status: "Active" }).sort({ name: 1 });
    return sendSuccess(res, StatusCodes.OK, "Active locations fetched successfully", locations);
  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch active locations", next);
  }
};

export const getCityRelatedEntitiesUser = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let city;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      city = await Location.findOne({ _id: slug, status: "Active" }).populate("metaDataId", "-_id -pageId -adminId -lastModified");
    } else {
      city = await Location.findOne({ slug: slug, status: "Active" }).populate("metaDataId", "-_id -pageId -adminId -lastModified");
    }

    if (!city) {
      return errorHandler(StatusCodes.NOT_FOUND, "City location not found or inactive", next);
    }

    const cityId = city._id;

    // Run parallel queries for stays, activities, destinations and custom sections using cityId
    const [stays, activities, destinations, customSectionsDoc] = await Promise.all([
      Stay.find({ mainCity: cityId, isActive: true }),
      Activity.find({ "location.mainCity": cityId, isActive: true }),
      Destination.find({ mainCity: cityId, status: "Active" }),
      CityDetailSections.findOne({ cityId })
    ]);

    // Find packages belonging to any destination inside this city
    const destinationIds = destinations.map(dest => dest._id);
    let packages = [];
    if (destinationIds.length > 0) {
      packages = await Package.find({
        "destination.id": { $in: destinationIds },
        status: "active"
      });
    }

    const responsePayload = {
      city,
      stays,
      activities,
      destinations,
      packages,
      customSections: customSectionsDoc ? customSectionsDoc.customSections : []
    };

    return sendSuccess(res, StatusCodes.OK, "City related inventory fetched successfully", responsePayload);

  } catch (error) {
    return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch city related inventory", next);
  }
};
