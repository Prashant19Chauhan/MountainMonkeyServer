import express from "express";
import { getBlogsUser, getBlogDetailUser } from "./blogs.controllers.js";

const router = express.Router();

router.get("/", getBlogsUser);
router.get("/:slug", getBlogDetailUser);

export default router;
