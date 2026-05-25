import mongoose from 'mongoose';

// --- FOLDER SCHEMA ---
const folderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true }
}, { timestamps: true });

// --- CATEGORY SCHEMA ---
const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

// --- IMAGE FILE SCHEMA ---
const imageFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true }, // Houses server path, e.g., '/uploads/image-123.jpg'
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  category: { type: String, required: true }
}, { timestamps: true });

export const Folder = mongoose.model('Folder', folderSchema);
export const Category = mongoose.model('Category', categorySchema);
export const ImageFile = mongoose.model('ImageFile', imageFileSchema);