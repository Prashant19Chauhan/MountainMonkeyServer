import express from "express"
import { createAndUpdateHomeHeroSection, getHomeHeroSection } from "./home.controllers.js"

const router = express.Router();

router.get("/hero", getHomeHeroSection)
router.post("/hero", createAndUpdateHomeHeroSection)

export default router