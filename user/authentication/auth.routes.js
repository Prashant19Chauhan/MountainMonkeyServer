import express from "express";
import { register, login, googleLogin, logout } from "./auth.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google-login', googleLogin)
router.post('/logout', authMiddleware(['user'], ['user']), logout)

export default router