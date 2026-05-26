import express from "express";
const router = express.Router();

import {
    getFeaturedPackages,
    getTropicalPackages,
    getPopularPackages,
    getPackageAdvertisements
} from "./packages.controllers.js";

import {
    getPackage,
    getSimilarPackageList,
    getPackageDestinationLocalInfo
} from "./details/details.controllers.js";

router.get("/featured", getFeaturedPackages);
router.get("/tropical", getTropicalPackages);
router.get("/popular", getPopularPackages);
router.get("/advertisements", getPackageAdvertisements);


router.get("/details/:packageSlug/destination-local-info/:destinationId", getPackageDestinationLocalInfo);
router.get("/details/:packageSlug/similar-packages", getSimilarPackageList);
router.get("/details/:packageSlug", getPackage);

export default router;
