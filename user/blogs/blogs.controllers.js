import Blog from "../../self/models/blog.model.js";
import { BlogDetailSections } from "../../self/models/blogDetailSections.model.js";
import { errorHandler, sendSuccess, StatusCodes } from "../../self/utility/error.utils.js";
import mongoose from "mongoose";

export const getBlogsUser = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", category = "" } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const filter = { status: "Active" };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        if (category) {
            filter.category = category;
        }

        const [blogs, total] = await Promise.all([
            Blog.find(filter)
                .select("title slug author shortDescription coverImage category tags createdAt")
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
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch blogs", next);
    }
};

export const getBlogDetailUser = async (req, res, next) => {
    try {
        const { slug } = req.params;

        let blog;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            blog = await Blog.findOne({ _id: slug, status: "Active" }).populate("metaDataId", "-_id -pageId -adminId -lastModified");
        } else {
            blog = await Blog.findOne({ slug: slug, status: "Active" }).populate("metaDataId", "-_id -pageId -adminId -lastModified");
        }

        if (!blog) {
            return errorHandler(StatusCodes.NOT_FOUND, "Blog article not found or inactive", next);
        }

        const blogId = blog._id;

        // Fetch related blogs of the same category (excluding this blog) and dynamic detail sections in parallel
        const [relatedBlogs, customSectionsDoc] = await Promise.all([
            Blog.find({ category: blog.category, _id: { $ne: blogId }, status: "Active" })
                .select("title slug coverImage author createdAt")
                .limit(3),
            BlogDetailSections.findOne({ blogId })
        ]);

        const responsePayload = {
            blog,
            relatedBlogs,
            customSections: customSectionsDoc ? customSectionsDoc.customSections : []
        };

        return sendSuccess(res, StatusCodes.OK, "Blog detail fetched successfully", responsePayload);
    } catch (error) {
        return errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Failed to fetch blog detail", next);
    }
};
