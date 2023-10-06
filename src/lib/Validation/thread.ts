import * as z from "zod";

export const threadValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Minimum 3 Characters Needed" })
    .nonempty(),
  account_id: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3, { message: "Minimum 3 Characters Needed" })
    .nonempty(),
});
