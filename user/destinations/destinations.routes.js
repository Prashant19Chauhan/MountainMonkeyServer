import express from "express";
const router = express.Router();

import {
    getAllDestinations,
    getTrendingDestinations,
    getTropicalDestinations,
    getHistoryDestinations,
    getDestinationAdvertisements
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


//destination details APIs --------------------------------------------------
router.get("/details/:destinationId", getDestinationDetails);
router.get("/activities/:destinationId", getDestinationsActivities);
router.get("/stays/:destinationId", getDestinationsStays);
router.get("/local-info/:destinationId", getDestinationLocalInfo);
router.get("/packages/:destinationId", getDestinationPackages);


export default router;
