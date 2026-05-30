import express from "express";
import { submitContactMessage } from "./contact.controllers.js";

const router = express.Router();

router.post("/submit", submitContactMessage);

export default router;
