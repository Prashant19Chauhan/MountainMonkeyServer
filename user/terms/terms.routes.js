import express from "express";
import { getTermsPageSectionsUser } from "./terms.controllers.js";

const router = express.Router();

router.get("/page/sections", getTermsPageSectionsUser);

export default router;
