import express from 'express';
import { createLocation, deleteLocation, updateLocation, getAllLocations, getCityById, getCityDetailSections, saveCityDetailSections } from './locations.controllers.js';
import { authMiddleware } from '../../self/middleware/auth.middlewares.js';

const router = express.Router();

router.post('/', authMiddleware(["admin"], ["admin"]), createLocation);
router.delete('/:id', authMiddleware(["admin"], ["admin"]), deleteLocation);
router.put('/:id', authMiddleware(["admin"], ["admin"]), updateLocation);
router.get('/', authMiddleware(["admin"], ["admin"]), getAllLocations);
router.get('/:id', authMiddleware(["admin"], ["admin"]), getCityById);
router.get('/:id/detail-sections', authMiddleware(["admin"], ["admin"]), getCityDetailSections);
router.post('/:id/detail-sections', authMiddleware(["admin"], ["admin"]), saveCityDetailSections);

export default router;