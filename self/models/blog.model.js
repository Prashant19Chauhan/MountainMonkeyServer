import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  metaDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetaData",
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  author: {
    type: String,
    default: "MountainMonkey Guide"
  },
  shortDescription: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ["Draft", "Active", "Inactive"],
    default: "Active"
  }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
