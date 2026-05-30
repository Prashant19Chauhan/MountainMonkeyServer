import express from "express";
import { getFaqPageSectionsUser } from "./faq.controllers.js";

const router = express.Router();

router.get("/page/sections", getFaqPageSectionsUser);

export default router;
