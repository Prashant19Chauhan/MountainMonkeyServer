import express from "express";
import { getThemeMetaData, updateThemeMetaData, deleteMood } from "./theme.controllers.js";

const router = express.Router();

router.get("/", getThemeMetaData);
router.post("/", updateThemeMetaData);
router.delete("/mood/:name", deleteMood);

export default router;
