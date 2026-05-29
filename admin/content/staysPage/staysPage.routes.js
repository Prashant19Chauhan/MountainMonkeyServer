import express from "express"
import { updateStaysPageSections, getStaysPageSections } from "./staysPage.controllers.js"

const router = express.Router();

router.get("/sections", getStaysPageSections);
router.post("/sections", updateStaysPageSections);

export default router;
