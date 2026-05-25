import express from "express";
import {
    createAdvertisement,
    getAdvertisements,
    getAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement
} from "./advertisement.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.post("/", authMiddleware(["admin"], ["admin"]), createAdvertisement);
router.get("/", authMiddleware(["admin"], ["admin"]), getAdvertisements);
router.get("/:id", authMiddleware(["admin"], ["admin"]), getAdvertisementById);
router.put("/:id", authMiddleware(["admin"], ["admin"]), updateAdvertisement);
router.delete("/:id", authMiddleware(["admin"], ["admin"]), deleteAdvertisement);

export default router;
