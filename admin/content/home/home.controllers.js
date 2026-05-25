import { HomePageSections } from "../../../self/models/home.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../../self/utility/error.utils.js";
import { createAndUpdateHomeHeroSectionSchema } from "./homeSchema.validations.js";

// ── Helpers ────────────────────────────────────────────────────────────────

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

// ── CREATE / UPDATE HERO SECTION ───────────────────────────────────────────

export const createAndUpdateHomeHeroSection = async (req, res, next) => {
    try {
        const validate = createAndUpdateHomeHeroSectionSchema.safeParse(req.body);
        if (!validate.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validate.error), next);
        }

        const validData = validate.data;

        let homeData = await HomePageSections.findOne();

        if (!homeData) {
            homeData = new HomePageSections({ heroSection: [validData] });
            await homeData.save();
        } else {
            const moodIndex = homeData.heroSection.findIndex(h => h.mood === validData.mood);

            if (moodIndex !== -1) {
                homeData.heroSection[moodIndex] = {
                    ...homeData.heroSection[moodIndex].toObject(),
                    ...validData,
                };
            } else {
                homeData.heroSection.push(validData);
            }

            await homeData.save();
        }

        return sendSuccess(
            res,
            StatusCodes.OK,
            `Hero section for mood '${validData.mood}' updated successfully`,
            homeData
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update hero section", next);
    }
};

// ── GET HERO SECTION ───────────────────────────────────────────────────────

export const getHomeHeroSection = async (req, res, next) => {
    try {
        const section = await HomePageSections.findOne();

        return sendSuccess(res, StatusCodes.OK, "Home hero section fetched successfully", section || null);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch hero section", next);
    }
};