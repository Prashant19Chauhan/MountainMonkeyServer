import { ThemeMetaData } from "../../self/models/theme.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";

/**
 * @desc Get application metadata (moods, travel styles, themes)
 * @route GET /mm/api/v1/admin/theme-meta-data
 * @access Admin
 */
export const getThemeMetaData = async (req, res, next) => {
    try {
        const metaData = await ThemeMetaData.findOne();

        return sendSuccess(
            res,
            StatusCodes.OK,
            "Theme meta data fetched successfully",
            metaData || { moods: [], travelStyle: [], theme: [] }
        );

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch theme meta data", next);
    }
};

/**
 * @desc Update or create application metadata
 * @route POST /mm/api/v1/admin/theme-meta-data
 * @access Admin
 */
export const updateThemeMetaData = async (req, res, next) => {
    try {
        const { moods, travelStyle, theme } = req.body;

        if (!moods && !travelStyle && !theme) {
            return errorHandler(StatusCodes.BAD_REQUEST, "At least one of 'moods', 'travelStyle', or 'theme' is required", next);
        }

        let metaData = await ThemeMetaData.findOne();

        if (!metaData) {
            metaData = new ThemeMetaData({ moods: [], travelStyle: [], theme: [] });
            await metaData.save();
        }

        // Merge moods by name
        if (moods && Array.isArray(moods)) {
            for (const newMood of moods) {
                if (!newMood.name) continue;
                const existingIndex = metaData.moods.findIndex(m => m.name === newMood.name);
                if (existingIndex !== -1) {
                    metaData.moods[existingIndex] = newMood;
                } else {
                    metaData.moods.push(newMood);
                }
            }
        }

        // Merge travel styles (unique)
        if (travelStyle && Array.isArray(travelStyle)) {
            travelStyle.forEach(style => {
                if (!metaData.travelStyle.includes(style)) {
                    metaData.travelStyle.push(style);
                }
            });
        }

        // Merge themes (unique)
        if (theme && Array.isArray(theme)) {
            theme.forEach(t => {
                if (!metaData.theme.includes(t)) {
                    metaData.theme.push(t);
                }
            });
        }

        await metaData.save();

        return sendSuccess(res, StatusCodes.OK, "Theme meta data updated successfully", metaData);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update theme meta data", next);
    }
};

/**
 * @desc Delete a specific mood from metadata
 * @route DELETE /mm/api/v1/admin/theme-meta-data/mood/:name
 * @access Admin
 */
export const deleteMood = async (req, res, next) => {
    try {
        const { name } = req.params;

        if (!name) {
            return errorHandler(StatusCodes.BAD_REQUEST, "Mood name is required", next);
        }

        const metaData = await ThemeMetaData.findOne();

        if (!metaData) {
            return errorHandler(StatusCodes.NOT_FOUND, "Theme meta data not found", next);
        }

        const moodExists = metaData.moods.some(m => m.name === name);
        if (!moodExists) {
            return errorHandler(StatusCodes.NOT_FOUND, `Mood '${name}' not found`, next);
        }

        metaData.moods = metaData.moods.filter(m => m.name !== name);
        await metaData.save();

        return sendSuccess(res, StatusCodes.OK, `Mood '${name}' deleted successfully`, metaData);

    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete mood", next);
    }
};
