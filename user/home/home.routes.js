import express from "express";
const router = express.Router();

import {
    homeHeroSection,
    homeCuratedPackages,
    homeTopDestinations,
    homePopularActivities,
    homeUniqueStays,
    homeUpcomingPackages,
    homeAdvertisements,
    homeTravelerStories,
    homeTestimonials
} from "./home.controllers.js";

router.get("/hero-section", homeHeroSection);
router.get("/curated-packages", homeCuratedPackages);
router.get("/top-destinations", homeTopDestinations);
router.get("/popular-activities", homePopularActivities);
router.get("/unique-stays", homeUniqueStays);
router.get("/upcoming-packages", homeUpcomingPackages);
router.get("/advertisements", homeAdvertisements);
router.get("/traveler-stories", homeTravelerStories);
router.get("/testimonials", homeTestimonials);

export default router;