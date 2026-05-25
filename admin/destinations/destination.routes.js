import express from "express";
import { createDestination, getAllDestinations, getDestinationById, deleteDestination, updateDestination } from "./destination.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.post("/create", authMiddleware(["admin"], ["admin", "sub-admin"]), createDestination);

router.get("/", authMiddleware(["admin"], ["admin", "sub-admin"]), getAllDestinations);

router.get("/:id", authMiddleware(["admin"], ["admin", "sub-admin"]), getDestinationById);

router.delete("/:id", authMiddleware(["admin"], ["admin", "sub-admin"]), deleteDestination);

router.put("/:id", authMiddleware(["admin"], ["admin", "sub-admin"]), updateDestination);

export default router;