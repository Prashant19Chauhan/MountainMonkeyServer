import express from "express"
import {
    createStay,
    updateStay,
    deleteStay,
    getStay,
    getAllStays
} from "./stay.controllers.js"
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router()

router.post("/", authMiddleware(["admin"], ["admin"]), createStay)
router.put("/:id", authMiddleware(["admin"], ["admin"]), updateStay)
router.delete("/:id", authMiddleware(["admin"], ["admin"]), deleteStay)
router.get("/:id", authMiddleware(["admin"], ["admin"]), getStay)
router.get("/", authMiddleware(["admin"], ["admin"]), getAllStays)

export default router 