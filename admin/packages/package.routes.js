import express from "express";
import {
    createPackage,
    updatePackage,
    getPackages,
    deletePackage,
    getPackage,
    updatePackageCurrentPrice
} from "./package.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();


router.post("/", authMiddleware(["admin"], ["admin"]), createPackage);
router.put("/:slug", authMiddleware(["admin"], ["admin"]), updatePackage);
router.patch("/:slug/current-price", authMiddleware(["admin"], ["admin"]), updatePackageCurrentPrice);
router.get("/", authMiddleware(["admin"], ["admin"]), getPackages);
router.delete("/:slug", authMiddleware(["admin"], ["admin"]), deletePackage);
router.get("/:slug", authMiddleware(["admin"], ["admin"]), getPackage);


export default router;