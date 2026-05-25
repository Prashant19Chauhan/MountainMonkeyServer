import express from "express";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js"
import { createMetaData, getSingleMetaData, updateMetaData } from "../metaData/metaData.controllers.js"

const router = express.Router();

router.post("/create/:typeOfPage/:pageId", authMiddleware(["admin"], ["admin"]), createMetaData);
router.get("/single/:pageId", authMiddleware(["admin"], ["admin"]), getSingleMetaData);
router.put("/update/:pageId", authMiddleware(["admin"], ["admin"]), updateMetaData);

export default router;
