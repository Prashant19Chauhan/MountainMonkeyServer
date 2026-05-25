import express from "express";
import { getThemeMetaData } from "./theme.controllers.js";

const router = express.Router();

router.get("/", getThemeMetaData);

export default router;
