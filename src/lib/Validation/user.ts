import * as z from "zod";

export const userValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Minimum 3 Characters Needed" })
    .max(30, { message: "Maximum 30 Characters Alllowed" })
    .nonempty(),
  username: z
    .string()
    .min(3, { message: "Minimum 3 Characters Needed" })
    .max(30, { message: "Maximum 30 Characters Alllowed" })
    .nonempty(),
  bio: z
    .string()
    .min(3, { message: "Minimum 3 Characters Needed" })
    .max(1000, { message: "Maximum 1000 Characters Alllowed" })
    .nonempty(),
});
