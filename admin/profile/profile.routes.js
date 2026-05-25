import express from 'express'
import { getProfileController, updateProfileController, deleteProfileController } from './profile.controllers.js'
import { authMiddleware } from '../../self/middleware/auth.middlewares.js'
const router = express.Router()

router.get('/', authMiddleware(["admin"], ["admin"]), getProfileController)
router.post('/', authMiddleware(["admin"], ["admin"]), updateProfileController)
router.delete('/', authMiddleware(["admin"], ["admin"]), deleteProfileController)

export default router