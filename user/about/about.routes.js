import express from "express";
import { getAboutPageSectionsUser } from "./about.controllers.js";

const router = express.Router();

router.get("/page/sections", getAboutPageSectionsUser);

export default router;
