import { z } from "zod";

export const updatePrivacyPageSectionsSchema = z.object({
  sections: z.array(z.object({
    heading: z.string({
      required_error: "section heading is required",
      invalid_type_error: "section heading must be a string"
    }).min(1, "section heading is required"),
    content: z.string({
      required_error: "content is required",
      invalid_type_error: "content must be a string"
    }).min(1, "content is required")
  }))
});
