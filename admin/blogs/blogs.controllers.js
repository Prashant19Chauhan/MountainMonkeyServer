import Blog from "../../self/models/blog.model.js";
import { BlogDetailSections } from "../../self/models/blogDetailSections.model.js";
import { generateSlug } from "../../self/utility/slug.utils.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import { createBlogSchema, deleteBlogSchema, updateBlogSchema } from "./blogs.validations.js";

const getValidationMessage = (zodError) => {
    const issue = zodError.issues[0];
    const field = issue?.path?.join(".") || "";
    return `${field ? `'${field}': ` : ""}${issue?.message || "Invalid request data"}`;
};

export const createBlog = async (req, res, next) => {
    try {
        const validationResult = createBlogSchema.safeParse(req.body);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const data = { ...validationResult.data };
        if (!data.slug && data.title) {
            data.slug = generateSlug(data.title);
        }

        const slugExists = await Blog.findOne({ slug: data.slug });
        if (slugExists) {
            return errorHandler(StatusCodes.CONFLICT, `A blog with the slug '${data.slug}' already exists. Please choose a unique title.`, next);
        }

        const blog = await Blog.create(data);
        return sendSuccess(res, StatusCodes.CREATED, "Blog created successfully", blog);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to create blog", next);
    }
};

export const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validationResult = updateBlogSchema.safeParse(req.body);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const data = { ...validationResult.data };
        if (data.title && !data.slug) {
            data.slug = generateSlug(data.title);
        }

        if (data.slug) {
            const slugExists = await Blog.findOne({ slug: data.slug, _id: { $ne: id } });
            if (slugExists) {
                return errorHandler(StatusCodes.CONFLICT, `A blog with the slug '${data.slug}' already exists. Please choose a unique title.`, next);
            }
        }

        const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
        if (!blog) {
            return errorHandler(StatusCodes.NOT_FOUND, "Blog not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Blog updated successfully", blog);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to update blog", next);
    }
};

export const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validationResult = deleteBlogSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return errorHandler(StatusCodes.NOT_FOUND, "Blog not found", next);
        }

        // Cleanup detail sections as well
        await BlogDetailSections.findOneAndDelete({ blogId: id });

        return sendSuccess(res, StatusCodes.OK, "Blog deleted successfully");
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to delete blog", next);
    }
};

export const getBlogs = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                    { author: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const [blogs, total] = await Promise.all([
            Blog.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Blog.countDocuments(filter),
        ]);

        return sendSuccess(res, StatusCodes.OK, "Blogs fetched successfully", blogs, {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit,
        });
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to get blogs", next);
    }
};

export const getBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validationResult = deleteBlogSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return errorHandler(StatusCodes.NOT_FOUND, "Blog not found", next);
        }

        return sendSuccess(res, StatusCodes.OK, "Blog fetched successfully", blog);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to get blog", next);
    }
};

export const getBlogDetailSections = async (req, res, next) => {
    try {
        const { id } = req.params; // Blog ObjectId
        const validationResult = deleteBlogSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return errorHandler(StatusCodes.NOT_FOUND, "Blog not found", next);
        }

        let sections = await BlogDetailSections.findOne({ blogId: id });
        if (!sections) {
            sections = { blogId: id, customSections: [] };
        }

        return sendSuccess(res, StatusCodes.OK, "Blog detail sections fetched successfully", sections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get blog detail sections", next);
    }
};

export const saveBlogDetailSections = async (req, res, next) => {
    try {
        const { id } = req.params; // Blog ObjectId
        const { customSections } = req.body;

        const validationResult = deleteBlogSchema.safeParse(id);
        if (!validationResult.success) {
            return errorHandler(StatusCodes.BAD_REQUEST, getValidationMessage(validationResult.error), next);
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return errorHandler(StatusCodes.NOT_FOUND, "Blog not found", next);
        }

        let sections = await BlogDetailSections.findOne({ blogId: id });
        if (sections) {
            sections.customSections = customSections || [];
            await sections.save();
        } else {
            sections = await BlogDetailSections.create({
                blogId: id,
                customSections: customSections || []
            });
        }

        return sendSuccess(res, StatusCodes.OK, "Blog detail sections saved successfully", sections);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to save blog detail sections", next);
    }
};
