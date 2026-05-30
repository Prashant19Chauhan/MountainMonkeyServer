import express from "express";
import { updateCitiesPageSections, getCitiesPageSections } from "./citiesPage.controllers.js";

const router = express.Router();

router.get("/sections", getCitiesPageSections);
router.post("/sections", updateCitiesPageSections);

export default router;
