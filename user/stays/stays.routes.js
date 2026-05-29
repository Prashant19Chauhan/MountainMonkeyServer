import express from "express";
const router = express.Router();

import {
    getAllStays,
    getStayAdvertisements,
    getStaysPageSections
} from "./stays.controllers.js";

import {
    getStayDetails,
    getStayLocalInfo
} from "./details/details.controllers.js";

router.get("/", getAllStays);
router.get("/advertisements", getStayAdvertisements);
router.get("/page/sections", getStaysPageSections);

router.get("/details/:staySlug", getStayDetails);
router.get("/local-info/:destinationId", getStayLocalInfo);

export default router;
