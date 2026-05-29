import express from "express"
import { updateDestinationsPageSections, getDestinationsPageSections } from "./destinationsPage.controllers.js"

const router = express.Router();

router.get("/sections", getDestinationsPageSections);
router.post("/sections", updateDestinationsPageSections);

export default router;
