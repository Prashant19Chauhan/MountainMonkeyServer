import express from "express"
import {
    createStay,
    updateStay,
    deleteStay,
    getStay,
    getAllStays,
    updateStayCurrentPrice
} from "./stay.controllers.js"
import { getStayDetailSections, updateStayDetailSections } from "./stayDetailSections.controllers.js"
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router()

router.post("/", authMiddleware(["admin"], ["admin"]), createStay)
router.put("/:slug", authMiddleware(["admin"], ["admin"]), updateStay)
router.patch("/:slug/current-price", authMiddleware(["admin"], ["admin"]), updateStayCurrentPrice)
router.delete("/:slug", authMiddleware(["admin"], ["admin"]), deleteStay)
router.get("/:slug", authMiddleware(["admin"], ["admin"]), getStay)
router.get("/", authMiddleware(["admin"], ["admin"]), getAllStays)

// Per-stay custom content sections
router.get("/:slug/detail-sections", authMiddleware(["admin"], ["admin"]), getStayDetailSections)
router.post("/:slug/detail-sections", authMiddleware(["admin"], ["admin"]), updateStayDetailSections)

export default router