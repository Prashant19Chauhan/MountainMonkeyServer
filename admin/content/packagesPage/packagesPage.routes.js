import express from "express"
import { updatePackagesPageSections, getPackagesPageSections } from "./packagesPage.controllers.js"

const router = express.Router();

router.get("/sections", getPackagesPageSections);
router.post("/sections", updatePackagesPageSections);

export default router;
