import express from "express";
import { createLocalInfo, getAllLocalInfo, getLocalInfo, updateLocalInfo, deleteLocalInfo } from "./localInfo.controllers.js";
import { authMiddleware } from "../../self/middleware/auth.middlewares.js";

const router = express.Router();

router.get("/", authMiddleware(["admin"], ["admin"]), getAllLocalInfo);
router.get("/:slug", authMiddleware(["admin"], ["admin"]), getLocalInfo);
router.post("/", authMiddleware(["admin"], ["admin"]), createLocalInfo);
router.put("/:slug", authMiddleware(["admin"], ["admin"]), updateLocalInfo);
router.delete("/:slug", authMiddleware(["admin"], ["admin"]), deleteLocalInfo);

export default router;