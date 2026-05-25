import express from "express"
import {registerAdmin, loginAdmin, logoutAdmin} from "./auth.controllers.js"
import { authMiddleware } from "../../self/middleware/auth.middlewares.js"

const router = express.Router()

router.post("/register", registerAdmin)
router.post("/login", loginAdmin)
router.post("/logout", authMiddleware(["admin"], ["admin"]), logoutAdmin)

export default router