import activityModel from "../../../self/models/activity.model.js";
import Destination from "../../../self/models/destination.model.js";
import localInfoModel from "../../../self/models/localInfo.model.js";
import packageModel from "../../../self/models/package.model.js";
import StayModel from "../../../self/models/stay.model.js";

export const getDestinationDetails = async (req, res) => {
    try {
        const { destinationSlug } = req.params;
        const destination = await Destination.findOne({ slug: destinationSlug })
            .select("name slug description shortDescription location.address location.pinCode mainCity placeType categories nearbyDestinations.destinationId budgetEstimate images rating analytics mainCity")
            .populate("metaDataId", "-_id -pageId -adminId -lastModified")
            .lean();
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        return res.status(200).json(destination);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDestinationsActivities = async (req, res) => {
    try {
        const { destinationSlug } = req.params;
        // Resolve destination _id from slug for related queries
        const destination = await Destination.findOne({ slug: destinationSlug }).select("_id");
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const activities = await activityModel.find({ destinationId: destination._id })
            .select("name slug type pricing")
            .lean();
        return res.status(200).json(activities);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDestinationsStays = async (req, res) => {
    try {
        const { destinationSlug } = req.params;
        const destination = await Destination.findOne({ slug: destinationSlug }).select("_id");
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const stays = await StayModel.find({ destinationId: destination._id })
            .select("name slug type starRating priceRange.min")
            .lean();
        return res.status(200).json(stays);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDestinationLocalInfo = async (req, res) => {
    try {
        const { destinationSlug } = req.params;
        const destination = await Destination.findOne({ slug: destinationSlug }).select("_id");
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const localInfo = await localInfoModel.find({ destinationId: destination._id })
            .select("-destinationId -embedding -lastUpdated -createdAt -updatedAt -__v -aiSummary")
            .lean();
        if (!localInfo) {
            return res.status(404).json({ message: "Local info not found" });
        }
        return res.status(200).json(localInfo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDestinationPackages = async (req, res) => {
    try {
        const { destinationSlug } = req.params;
        const destination = await Destination.findOne({ slug: destinationSlug }).select("_id");
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const packages = await packageModel.find({ "destination.id": destination._id })
            .select("title slug duration pricing.basePrice categories rating")
            .lean();
        if (!packages) {
            return res.status(404).json({ message: "Packages not found" });
        }
        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
