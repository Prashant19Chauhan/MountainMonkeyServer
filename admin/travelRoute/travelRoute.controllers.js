import TravelRoute from "../../self/models/travelRoute.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createTravelRouteSchema } from "./travelRouteSchema.validations.js";
import { smartRouteFinder, findCheapestAndFastestAndShortestDistanceRoute } from "./travelRoute.services.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

const buildSmartRoutes = (StepRoutes, cheapestRouteId, fastestRouteId, shortestDistanceId) => {
    return StepRoutes.map((step) => {
        if (!step.isDestinationReached) return null;

        const routeTypes = [
            step.stepId === cheapestRouteId && "cheapest",
            step.stepId === fastestRouteId && "fastest",
            step.stepId === shortestDistanceId && "shortestDistance",
            step.totalStops === 0 && "direct",
        ].filter(Boolean);

        return smartRouteFinder(
            routeTypes.length ? routeTypes : ["normal"],
            step,
            StepRoutes
        );
    }).filter(Boolean);
};

// ── CREATE ─────────────────────────────────────────────────────────────────

/**
 * @desc Create Travel Route
 * @route POST /api/travel-routes
 * @access Admin
 */
export const createTravelRoute = async (req, res, next) => {
    try {
        let data = req.body;
        const adminId = req.user?._id;

        data.adminId = adminId;

        const validatedData = createTravelRouteSchema.safeParse(data);
        if (!validatedData.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validatedData.error), next);
        }

        const existingRoute = await TravelRoute.findOne({
            adminId,
            "from.id": validatedData.data.from.id,
            "to.id": validatedData.data.to.id,
        });

        if (existingRoute) {
            return errorHandler(StatusCodes.CONFLICT, "A travel route between these two locations already exists", next);
        }

        const { from, to, StepRoutes } = validatedData.data;
        const { cheapestRouteId, fastestRouteId, shortestDistanceId } = findCheapestAndFastestAndShortestDistanceRoute(StepRoutes);
        const smartRoutes = buildSmartRoutes(StepRoutes, cheapestRouteId, fastestRouteId, shortestDistanceId);

        const travelRoute = new TravelRoute({
            from,
            to,
            routes: StepRoutes,
            smartRoutes,
            stats: { cheapestRouteId, fastestRouteId },
            connectivityScore: 0,
            popularityScore: 0,
            lastUpdated: new Date(),
        });

        await travelRoute.save();

        return sendSuccess(res, StatusCodes.CREATED, "Travel route created successfully", travelRoute);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create travel route", next);
    }
};

// ── GET ALL FOR DESTINATION ────────────────────────────────────────────────

export const getAllRoutesForDestination = async (req, res, next) => {
    try {
        const { fromId, destinationId } = req.query;
        const adminId = req.user?._id;

        if (!destinationId) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Destination ID is required", next);
        }

        const query = { "to.id": destinationId };
        if (fromId) query["from.id"] = fromId;

        const travelRoutes = await TravelRoute.find({ adminId, ...query });

        return sendSuccess(res, StatusCodes.OK, "Travel routes fetched successfully", travelRoutes);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch travel routes", next);
    }
};

// ── UPDATE ─────────────────────────────────────────────────────────────────

export const updateTravelRoute = async (req, res, next) => {
    try {
        const { routeId } = req.params;
        const { StepRoutes, name } = req.body;
        const adminId = req.user?._id;

        if (!routeId) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Route ID is required", next);
        }

        if (!StepRoutes || !Array.isArray(StepRoutes) || StepRoutes.length === 0) {
            return errorHandler(StatusCodes.BAD_REQUEST, "'StepRoutes' must be a non-empty array", next);
        }

        const travelRoute = await TravelRoute.findOne({ adminId, _id: routeId });
        if (!travelRoute) {
            return errorHandler(StatusCodes.NOT_FOUND, "Travel route not found or you do not have permission to update it", next);
        }

        if (name) travelRoute.name = name;

        travelRoute.routes = StepRoutes;

        const { cheapestRouteId, fastestRouteId, shortestDistanceId } = findCheapestAndFastestAndShortestDistanceRoute(StepRoutes);
        travelRoute.smartRoutes = buildSmartRoutes(StepRoutes, cheapestRouteId, fastestRouteId, shortestDistanceId);
        travelRoute.stats = { cheapestRouteId, fastestRouteId, shortestDistanceId };

        await travelRoute.save();

        return sendSuccess(res, StatusCodes.OK, "Travel route updated successfully", travelRoute);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update travel route", next);
    }
};

// ── DELETE ─────────────────────────────────────────────────────────────────

export const deleteTravelRoute = async (req, res, next) => {
    try {
        const { routeId } = req.params;
        const adminId = req.user?._id;

        if (!routeId) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Route ID is required", next);
        }

        const travelRoute = await TravelRoute.findOne({ adminId, _id: routeId });
        if (!travelRoute) {
            return errorHandler(StatusCodes.NOT_FOUND, "Travel route not found or you do not have permission to delete it", next);
        }

        await travelRoute.deleteOne();

        return sendSuccess(res, StatusCodes.OK, "Travel route deleted successfully");

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete travel route", next);
    }
};

// ── GET ALL (LISTED) ───────────────────────────────────────────────────────

export const getAllRoutesListed = async (req, res, next) => {
    try {
        const adminId = req.user?._id;

        const travelRoutes = await TravelRoute.find({ adminId });

        return sendSuccess(res, StatusCodes.OK, "All travel routes fetched successfully", travelRoutes);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch travel routes", next);
    }
};

// ── GET ONE ────────────────────────────────────────────────────────────────

export const getTravelRouteById = async (req, res, next) => {
    try {
        const { routeId } = req.params;
        const adminId = req.user?._id;

        if (!routeId) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Route ID is required", next);
        }

        const travelRoute = await TravelRoute.findOne({ adminId, _id: routeId });
        if (!travelRoute) {
            return errorHandler(StatusCodes.NOT_FOUND, "Travel route not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Travel route fetched successfully", travelRoute);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch travel route", next);
    }
};
