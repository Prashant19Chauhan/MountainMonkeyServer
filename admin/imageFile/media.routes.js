import express from "express";
const router = express.Router();

import { uploadMiddleware } from "../../self/middleware/upload.middleware.js";
import {createImageFile, getImageFiles, deleteImageFile, createFolder, updateFolder, deleteFolder, getCategories, createCategory, updateCategory, deleteCategory, getAllFolders, getImage, getImageByIds} from "./media.controllers.js"
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

// Create image file
router.post("/upload", uploadMiddleware.single("imageFile"), authMiddleware(["admin"], ["admin"]), createImageFile);

// Get all image files
router.get("/", authMiddleware(["admin"], ["admin"]), getImageFiles);

// Delete image file
router.delete("/:id", authMiddleware(["admin"], ["admin"]), deleteImageFile);

// Get all folders
router.get("/folders", authMiddleware(["admin"], ["admin"]), getAllFolders);

// Create folder
router.post("/folder", authMiddleware(["admin"], ["admin"]), createFolder);

// Update folder
router.put("/folder/:id", authMiddleware(["admin"], ["admin"]), updateFolder);

// Delete folder
router.delete("/folder/:id", authMiddleware(["admin"], ["admin"]), deleteFolder);

// Get all categories
router.get("/categories", authMiddleware(["admin"], ["admin"]), getCategories);

// Create category
router.post("/category", authMiddleware(["admin"], ["admin"]), createCategory);

// Update category
router.put("/category/:id", authMiddleware(["admin"], ["admin"]), updateCategory);

// Delete category
router.delete("/category/:id", authMiddleware(["admin"], ["admin"]), deleteCategory);

// Get image
router.get("/getImage/:id", authMiddleware(["admin"], ["admin"]), getImage);

//get images by Id
router.get("/getAllImages/:id", authMiddleware(["admin"], ["admin"]), getImageByIds);





export default router;