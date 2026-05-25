import localInfoModel from "../../../self/models/localInfo.model.js";
import packageModel from "../../../self/models/package.model.js";

export const getPackage = async (req, res) => {
    try {
        const { packageId } = req.params;
        const packageDetails = await packageModel.findById(packageId)
            .select("-aiMetadata -vendor -status -createdAt -updatedAt")
            .populate("activities.id", "name")
            .populate("accommodations.stayId", "name")
            .populate("destination.id", "name location.address")
            .populate("metaDataId", "-_id -pageId -adminId -lastModified")
            .lean();
        if (!packageDetails) {
            return res.status(404).json({ message: "Package not found" });
        }
        return res.status(200).json({ packageDetails });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getPackageDestinationLocalInfo = async (req, res) => {
    try {
        const { destinationId } = req.params;
        console.log(destinationId);
        const packageDetailsLocalInfo = await localInfoModel.find({ destinationId: destinationId })
            .select("-destinationId -embedding -lastUpdated -createdAt -updatedAt -__v -aiSummary")
            .lean();
        if (!packageDetailsLocalInfo) {
            return res.status(404).json({ message: "Package local info not found" });
        }
        return res.status(200).json({ packageDetailsLocalInfo });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getSimilarPackageList = async (req, res) => {
    try {
        const { packageId } = req.params;
        const { destinationId, category } = req.query;
        const query = {
            "destination.id": destinationId,
            _id: { $ne: packageId },
            status: "active",
        };
        if (category) {
            query.categories = { $in: category.split(",") };
        }

        console.log(query);
        const similarPackageList = await packageModel.find(query)
            .select("title slug duration pricing.basePrice categories rating images")
            .limit(8)
            .lean();
        if (!similarPackageList) {
            return res.status(404).json({ message: "Similar package list not found" });
        }
        return res.status(200).json({ similarPackageList });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}