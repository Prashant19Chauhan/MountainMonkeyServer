import express from "express";
import { getActiveLocationsUser, getCityRelatedEntitiesUser } from "./locations.controllers.js";

const router = express.Router();

router.get("/active", getActiveLocationsUser);
router.get("/:slug/related", getCityRelatedEntitiesUser);

export default router;
