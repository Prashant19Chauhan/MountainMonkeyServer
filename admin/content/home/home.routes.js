import express from "express"
import { createAndUpdateHomeHeroSection, getHomeHeroSection, updateHomeCustomSections } from "./home.controllers.js"

const router = express.Router();

router.get("/hero", getHomeHeroSection)
router.post("/hero", createAndUpdateHomeHeroSection)
router.post("/custom-sections", updateHomeCustomSections)

export default router