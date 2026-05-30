import express from "express";
import { updateFaqPageSections, getFaqPageSections } from "./faqPage.controllers.js";

const router = express.Router();

router.get("/sections", getFaqPageSections);
router.post("/sections", updateFaqPageSections);

export default router;
