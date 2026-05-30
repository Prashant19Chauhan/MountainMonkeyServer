import express from "express";
import { updateAboutPageSections, getAboutPageSections } from "./aboutPage.controllers.js";

const router = express.Router();

router.get("/sections", getAboutPageSections);
router.post("/sections", updateAboutPageSections);

export default router;
