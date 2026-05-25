import { verifyAccessToken } from "../utility/token.utils.js";
import { errorHandler } from "../utility/error.utils.js";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = (scope = [], roles = []) => {
    return async(req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return errorHandler(StatusCodes.UNAUTHORIZED, "Access token is missing or malformed", next);
            }

            const accessToken = authHeader.split(" ")[1];
            if (!accessToken) {
                return errorHandler(StatusCodes.UNAUTHORIZED, "Access token is required", next);
            }

            const decodeToken = verifyAccessToken(accessToken);

            if (!decodeToken) {
                return errorHandler(StatusCodes.UNAUTHORIZED, "Invalid or expired access token", next);
            }

            if (roles.length > 0 && !roles.includes(decodeToken.role)) {
                return errorHandler(StatusCodes.FORBIDDEN, "You do not have permission to perform this action", next);
            }

            if (scope.length > 0 && !scope.includes(decodeToken.scope)) {
                return errorHandler(StatusCodes.FORBIDDEN, "Access scope is not permitted for this resource", next);
            }

            req.user = decodeToken;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return errorHandler(StatusCodes.UNAUTHORIZED, "Access token has expired. Please log in again", next);
            }
            if (error.name === "JsonWebTokenError") {
                return errorHandler(StatusCodes.UNAUTHORIZED, "Invalid access token", next);
            }
            return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Authentication failed", next);
        }
    }
}
