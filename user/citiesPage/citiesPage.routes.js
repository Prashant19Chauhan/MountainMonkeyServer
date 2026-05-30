import express from "express";
import { getCitiesPageSectionsUser } from "./citiesPage.controllers.js";

const router = express.Router();

router.get("/page/sections", getCitiesPageSectionsUser);

export default router;
