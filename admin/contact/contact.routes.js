import express from "express";
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from "./contact.controllers.js";

const router = express.Router();

router.get("/messages", getContactMessages);
router.patch("/messages/:id", updateContactMessageStatus);
router.delete("/messages/:id", deleteContactMessage);

export default router;
