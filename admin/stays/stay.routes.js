import express from "express"
import {
    createStay,
    updateStay,
    deleteStay,
    getStay,
    getAllStays,
    updateStayCurrentPrice
} from "./stay.controllers.js"
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router()

router.post("/", authMiddleware(["admin"], ["admin"]), createStay)
router.put("/:slug", authMiddleware(["admin"], ["admin"]), updateStay)
router.patch("/:slug/current-price", authMiddleware(["admin"], ["admin"]), updateStayCurrentPrice)
router.delete("/:slug", authMiddleware(["admin"], ["admin"]), deleteStay)
router.get("/:slug", authMiddleware(["admin"], ["admin"]), getStay)
router.get("/", authMiddleware(["admin"], ["admin"]), getAllStays)

export default router