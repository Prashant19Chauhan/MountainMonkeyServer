import express from 'express';
import { 
    createBlog, 
    updateBlog, 
    deleteBlog, 
    getBlogs, 
    getBlogById, 
    getBlogDetailSections, 
    saveBlogDetailSections 
} from './blogs.controllers.js';
import { authMiddleware } from '../../self/middleware/auth.middlewares.js';

const router = express.Router();

router.post('/', authMiddleware(["admin"], ["admin"]), createBlog);
router.put('/:id', authMiddleware(["admin"], ["admin"]), updateBlog);
router.delete('/:id', authMiddleware(["admin"], ["admin"]), deleteBlog);
router.get('/', authMiddleware(["admin"], ["admin"]), getBlogs);
router.get('/:id', authMiddleware(["admin"], ["admin"]), getBlogById);
router.get('/:id/detail-sections', authMiddleware(["admin"], ["admin"]), getBlogDetailSections);
router.post('/:id/detail-sections', authMiddleware(["admin"], ["admin"]), saveBlogDetailSections);

export default router;
