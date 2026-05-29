import express from "express";
const router = express.Router();

import {
    getAllDestinations,
    getTrendingDestinations,
    getTropicalDestinations,
    getHistoryDestinations,
    getDestinationAdvertisements,
    getDestinationsPageSections,
    getDestinationDetailSectionsUser
} from "./destinations.controllers.js";

import {
    getDestinationDetails,
    getDestinationsActivities,
    getDestinationsStays,
    getDestinationLocalInfo,
    getDestinationPackages
} from "./destinationDetails/details.controllers.js";


//destination APIs -------------------------------------------------------
router.get("/", getAllDestinations);
router.get("/trending", getTrendingDestinations);
router.get("/tropical", getTropicalDestinations);
router.get("/history", getHistoryDestinations);
router.get("/advertisements", getDestinationAdvertisements);
router.get("/page/sections", getDestinationsPageSections);
router.get("/detail-sections/:destinationSlug", getDestinationDetailSectionsUser);


//destination details APIs --------------------------------------------------
router.get("/details/:destinationSlug", getDestinationDetails);
router.get("/activities/:destinationSlug", getDestinationsActivities);
router.get("/stays/:destinationSlug", getDestinationsStays);
router.get("/local-info/:destinationSlug", getDestinationLocalInfo);
router.get("/packages/:destinationSlug", getDestinationPackages);


export default router;
