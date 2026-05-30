import express from "express";
import { updatePrivacyPageSections, getPrivacyPageSections } from "./privacyPage.controllers.js";

const router = express.Router();

router.get("/sections", getPrivacyPageSections);
router.post("/sections", updatePrivacyPageSections);

export default router;
