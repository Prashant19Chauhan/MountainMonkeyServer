import { z } from "zod";

export const updateFaqPageSectionsSchema = z.object({
  sections: z.array(z.object({
    heading: z.string({
      required_error: "section heading is required",
      invalid_type_error: "section heading must be a string"
    }).min(1, "section heading is required"),
    faqs: z.array(z.object({
      question: z.string({
        required_error: "question is required"
      }).min(1, "question is required"),
      answer: z.string({
        required_error: "answer is required"
      }).min(1, "answer is required"),
      link: z.object({
        text: z.string().optional().default(""),
        url: z.string().optional().default("")
      }).optional()
    }))
  }))
});
