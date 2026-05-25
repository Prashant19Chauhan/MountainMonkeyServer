import express from "express"
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";

import path from "path";
import { StatusCodes } from "http-status-codes";

import userRouter from "./user.routes.js";
import adminRouter from "./admin.routes.js";


dotenv.config()

const app = express()

    // ── Compression (before routes for smaller responses) ──────────────────
    app.use(compression())

    app.use(cookieParser())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: process.env.CLIENT_URLS
            ? process.env.CLIENT_URLS.split(',').map(url => url.trim())
            : [],
        credentials: true
    }))

    app.get('/', (req, res) => {
        res.send('Server is running!')
    })


    const APIsVersion = "/mm/api"

    //Serve static files
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


    //user APIs
    app.use(`${APIsVersion}`, userRouter)


    //admin APIs
    app.use(`${APIsVersion}/v1`, adminRouter)


    // ── Global Error Handler ──────────────────────────────────────────────
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const message = err.message || "Internal Server Error";
        if (statusCode >= 500) console.error("[Server Error]", err);

        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
        });
    })

    // ── 404 Handler ───────────────────────────────────────────────────────
    app.use((req, res) => {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: `Route ${req.method} ${req.originalUrl} not found`,
        });
    });

export default app