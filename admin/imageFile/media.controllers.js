import { Folder, Category, ImageFile } from '../self/mediaModels.js';
import { StatusCodes } from '../../self/utility/error.utils.js';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// ── Helper: safely delete local files ────────────────────────────────────

const cleanLocalFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const deleteCloudinaryFile = async (imageUrl) => {
    try {
        if (imageUrl && imageUrl.startsWith("http")) {
            const parts = imageUrl.split('/');
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
                const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
                const publicId = publicIdWithExt.split('.').slice(0, -1).join('.');
                await cloudinary.uploader.destroy(publicId);
                console.log("Deleted from Cloudinary:", publicId);
            }
        }
    } catch (err) {
        console.error("Failed to delete from Cloudinary:", err);
    }
};

// ==========================================
// FOLDER ACTIONS
// ==========================================

export const getAllFolders = async (req, res) => {
    try {
        const userId = req.user?._id;
        const folders = await Folder.find({ userId }).sort({ createdAt: -1 });
        return res.status(StatusCodes.OK).json({ success: true, message: "Folders fetched successfully", data: folders });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch folders", error: error.message });
    }
};

export const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;

        if (!name || !name.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Folder name is required" });
        }

        const newFolder = await Folder.create({ name: name.trim(), userId });
        return res.status(StatusCodes.CREATED).json({ success: true, message: "Folder created successfully", data: newFolder });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create folder", error: error.message });
    }
};

export const updateFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user?._id;

        if (!name || !name.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Folder name cannot be empty" });
        }

        const updatedFolder = await Folder.findOneAndUpdate(
            { _id: id, userId },
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        if (!updatedFolder) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Folder not found" });
        }

        return res.status(StatusCodes.OK).json({ success: true, message: "Folder updated successfully", data: updatedFolder });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update folder", error: error.message });
    }
};

export const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const folder = await Folder.findOne({ _id: id, userId });
        if (!folder) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Folder not found" });
        }

        // Delete all images in folder from disk or Cloudinary
        const childImages = await ImageFile.find({ folderId: id, userId });
        for (const img of childImages) {
            if (img.url && img.url.startsWith("http")) {
                await deleteCloudinaryFile(img.url);
            } else {
                const physicalPath = path.join(process.cwd(), img.url);
                cleanLocalFile(physicalPath);
            }
        }

        await ImageFile.deleteMany({ folderId: id });
        await Folder.findByIdAndDelete(id);

        return res.status(StatusCodes.OK).json({ success: true, message: "Folder and its contents deleted successfully" });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete folder", error: error.message });
    }
};

// ==========================================
// IMAGE FILE ACTIONS
// ==========================================

export const createImageFile = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No image file was uploaded" });
        }

        const { title, folderId, category } = req.body;

        if (!title || !folderId || !category) {
            cleanLocalFile(req.file.path);
            if (req.file.path && req.file.path.startsWith("http")) {
                await deleteCloudinaryFile(req.file.path);
            }
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Required fields are missing: 'title', 'folderId', and 'category' are required",
            });
        }

        const folderExists = await Folder.findOne({ _id: folderId, userId });
        if (!folderExists) {
            cleanLocalFile(req.file.path);
            if (req.file.path && req.file.path.startsWith("http")) {
                await deleteCloudinaryFile(req.file.path);
            }
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Target folder not found" });
        }

        const imageUrl = req.file.path || `/uploads/${req.file.filename}`;

        const newImage = await ImageFile.create({
            title: title.trim(),
            url: imageUrl,
            folderId,
            category: category.trim(),
            userId,
        });

        return res.status(StatusCodes.CREATED).json({ success: true, message: "Image uploaded successfully", data: newImage });

    } catch (error) {
        if (req.file) {
            cleanLocalFile(req.file.path);
            if (req.file.path && req.file.path.startsWith("http")) {
                await deleteCloudinaryFile(req.file.path);
            }
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to upload image", error: error.message });
    }
};

export const getImageFiles = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { folderId, category } = req.query;
        const queryFilter = { userId };

        if (folderId) queryFilter.folderId = folderId;
        if (category && category !== 'All') queryFilter.category = category;

        const images = await ImageFile.find(queryFilter).sort({ createdAt: -1 });
        return res.status(StatusCodes.OK).json({ success: true, message: "Images fetched successfully", data: images });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch images", error: error.message });
    }
};

export const deleteImageFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const targetImage = await ImageFile.findOne({ _id: id, userId });
        if (!targetImage) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Image not found" });
        }

        if (targetImage.url && targetImage.url.startsWith("http")) {
            await deleteCloudinaryFile(targetImage.url);
        } else {
            const physicalDrivePath = path.join(process.cwd(), targetImage.url);
            cleanLocalFile(physicalDrivePath);
        }

        await ImageFile.findByIdAndDelete(id);

        return res.status(StatusCodes.OK).json({ success: true, message: "Image deleted successfully" });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete image", error: error.message });
    }
};

// ==========================================
// CATEGORY TAG ACTIONS
// ==========================================

export const getCategories = async (req, res) => {
    try {
        const userId = req.user?._id;
        const dataTags = await Category.find({ userId }).sort({ name: 1 });
        return res.status(StatusCodes.OK).json({ success: true, message: "Categories fetched successfully", data: dataTags });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch categories", error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user?._id;

        if (!name || !name.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Category name is required" });
        }

        const formattedName = name.trim();

        const redundantCheck = await Category.findOne({
            name: { $regex: new RegExp(`^${formattedName}$`, 'i') },
            userId,
        });

        if (redundantCheck) {
            return res.status(StatusCodes.CONFLICT).json({ success: false, message: `Category '${formattedName}' already exists` });
        }

        const freshCategory = await Category.create({ name: formattedName, userId });
        return res.status(StatusCodes.CREATED).json({ success: true, message: "Category created successfully", data: freshCategory });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create category", error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user?._id;

        if (!name || !name.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Category name cannot be empty" });
        }

        const targetCategory = await Category.findOne({ _id: id, userId });
        if (!targetCategory) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Category not found" });
        }

        const historicName = targetCategory.name;
        const cleanNewName = name.trim();

        targetCategory.name = cleanNewName;
        await targetCategory.save();

        // Cascade update to images with old category name
        await ImageFile.updateMany({ category: historicName, userId }, { category: cleanNewName });

        return res.status(StatusCodes.OK).json({ success: true, message: "Category updated successfully", data: targetCategory });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update category", error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const categoryDoc = await Category.findOne({ _id: id, userId });
        if (!categoryDoc) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Category not found" });
        }

        // Reassign images to 'Misc' before deleting category
        await ImageFile.updateMany({ category: categoryDoc.name, userId }, { category: 'Misc' });
        await Category.deleteOne({ _id: id, userId });

        return res.status(StatusCodes.OK).json({ success: true, message: "Category deleted; associated images moved to 'Misc'" });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete category", error: error.message });
    }
};

export const getImageByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        const userId = req.user?._id;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "'ids' must be a non-empty array" });
        }

        const images = await ImageFile.find({ _id: { $in: ids }, userId });
        return res.status(StatusCodes.OK).json({ success: true, message: "Images fetched successfully", data: images });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch images", error: error.message });
    }
};

export const getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const image = await ImageFile.findOne({ _id: id, userId });
        if (!image) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Image not found" });
        }

        return res.status(StatusCodes.OK).json({ success: true, message: "Image fetched successfully", data: image });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch image", error: error.message });
    }
};