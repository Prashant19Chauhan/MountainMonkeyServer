import { z } from "zod";

/* =========================================================
   SEO / Metadata Validation Schema
========================================================= */

export const seoValidationSchema = z.object({
  pageId: z
    .string()
    .min(3, "Page ID is required"),

  metaTitle: z
    .string()
    .min(3, "Meta title must be at least 3 characters")
    .max(70, "Meta title should not exceed 70 characters"),

  metaDescription: z
    .string()
    .min(20, "Meta description must be at least 20 characters")
    .max(160, "Meta description should not exceed 160 characters"),

  keywords: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),

  focusKeyword: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  secondaryKeywords: z.array(z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" })).optional(),

  canonicalUrl: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url("Invalid canonical URL").optional(),

  robots: z
    .object({
      index: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(true),

      follow: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(true),

      noarchive: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(false),

      nosnippet: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(false),

      noimageindex: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(false)
    })
    .optional(),

  openGraph: z
    .object({
      title: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      description: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      image: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url("Invalid OpenGraph image URL").optional(),

      imageAlt: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      type: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).default("website"),

      url: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url("Invalid OpenGraph URL").optional(),

      siteName: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      locale: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).default("en_US")
    })
    .optional(),

  twitter: z
    .object({
      card: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).default("summary_large_image"),

      title: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      description: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

      image: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url("Invalid Twitter image URL").optional(),

      creator: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional()
    })
    .optional(),

  schemaType: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  structuredData: z.any().optional(),

  faqSchema: z
    .array(
      z.object({
        question: z
          .string()
          .min(3, "FAQ question is required"),

        answer: z
          .string()
          .min(3, "FAQ answer is required")
      })
    )
    .optional(),

  breadcrumbTitle: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).optional(),

  alternateLanguages: z
    .array(
      z.object({
        language: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }),

        url: z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).url("Invalid alternate language URL")
      })
    )
    .optional(),

  ogImageWidth: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).optional(),

  ogImageHeight: z.number({ required_error: "This field is required", invalid_type_error: "This field must be a number" }).optional(),

  priority: z
    .number()
    .min(0)
    .max(1)
    .default(0.8),

  changeFrequency: z
    .enum([
      "always",
      "hourly",
      "daily",
      "weekly",
      "monthly",
      "yearly",
      "never"
    ])
    .default("weekly"),

  lastModified: z
    .union([
      z.date(),
      z.string({ required_error: "This field is required", invalid_type_error: "This field must be a string" }).datetime()
    ])
    .optional(),

  sitemapInclude: z.boolean({ required_error: "This field is required", invalid_type_error: "This field must be a boolean" }).default(true),

  seoScore: z
    .number()
    .min(0)
    .max(100)
    .optional()
});