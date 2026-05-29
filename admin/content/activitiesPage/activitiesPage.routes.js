import express from "express"
import { updateActivitiesPageSections, getActivitiesPageSections } from "./activitiesPage.controllers.js"

const router = express.Router();

router.get("/sections", getActivitiesPageSections);
router.post("/sections", updateActivitiesPageSections);

export default router;
