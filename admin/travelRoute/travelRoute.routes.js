import express from "express";
import { createTravelRoute, getAllRoutesForDestination, updateTravelRoute, deleteTravelRoute, getTravelRouteById, getAllRoutesListed } from "./travelRoute.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.post("/", authMiddleware(["admin"], ["admin"]), createTravelRoute);
router.get("/", authMiddleware(["admin"], ["admin"]), getAllRoutesForDestination);
router.put("/:routeId", authMiddleware(["admin"], ["admin"]), updateTravelRoute);
router.delete("/:routeId", authMiddleware(["admin"], ["admin"]), deleteTravelRoute);
router.get("/:routeId", authMiddleware(["admin"], ["admin"]), getTravelRouteById);
router.get("/allRoutes/list", authMiddleware(["admin"], ["admin"]), getAllRoutesListed);

export default router;