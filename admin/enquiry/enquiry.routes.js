import express from "express"
import {
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
} from "./enquiry.controllers.js"
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router()

router.get("/", authMiddleware(["admin"], ["admin"]), getAllEnquiries)
router.patch("/:id/status", authMiddleware(["admin"], ["admin"]), updateEnquiryStatus)
router.delete("/:id", authMiddleware(["admin"], ["admin"]), deleteEnquiry)

export default router
