import express from "express";
import {
    createPackage,
    updatePackage,
    getPackages,
    deletePackage,
    getPackage,
} from "./package.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();


router.post("/", authMiddleware(["admin"], ["admin"]), createPackage);
router.put("/:id", authMiddleware(["admin"], ["admin"]), updatePackage);
router.get("/", authMiddleware(["admin"], ["admin"]), getPackages);
router.delete("/:id", authMiddleware(["admin"], ["admin"]), deletePackage);
router.get("/:id", authMiddleware(["admin"], ["admin"]), getPackage);


export default router;