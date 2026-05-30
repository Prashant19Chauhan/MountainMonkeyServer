import express from "express";
import { getPrivacyPageSectionsUser } from "./privacy.controllers.js";

const router = express.Router();

router.get("/page/sections", getPrivacyPageSectionsUser);

export default router;
