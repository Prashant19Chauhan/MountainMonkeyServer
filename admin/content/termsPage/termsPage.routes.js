import express from "express";
import { updateTermsPageSections, getTermsPageSections } from "./termsPage.controllers.js";

const router = express.Router();

router.get("/sections", getTermsPageSections);
router.post("/sections", updateTermsPageSections);

export default router;
