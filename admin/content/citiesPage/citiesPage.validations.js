import { z } from "zod";

export const updateCitiesPageSectionsSchema = z.object({
  title: z.string({
    required_error: "title is required",
    invalid_type_error: "title must be a string"
  }).min(1, "title is required"),
  description: z.string({
    required_error: "description is required",
    invalid_type_error: "description must be a string"
  }).min(1, "description is required"),
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
