import express from "express";
import { getThemeMetaData, getPageMetaDataUser } from "./theme.controllers.js";

const router = express.Router();

router.get("/", getThemeMetaData);
router.get("/page/:pageId", getPageMetaDataUser);

export default router;
