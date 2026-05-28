import express from "express";
const router = express.Router();

import {
    getFeaturedActivities,
    getPopularActivities,
    getExploreActivities,
    getActivityAdvertisements,
    getAllActivities
} from "./activities.controllers.js";

import {
    getActivityDetails,
    getDestinationLocalInfo
} from "./details/details.controllers.js";


router.get("/all", getAllActivities);
router.get("/featured", getFeaturedActivities);
router.get("/popular", getPopularActivities);
router.get("/explore", getExploreActivities);
router.get("/advertisements", getActivityAdvertisements);


router.get("/:activitySlug/details", getActivityDetails);
router.get("/:destinationId/local-info", getDestinationLocalInfo);

export default router;
