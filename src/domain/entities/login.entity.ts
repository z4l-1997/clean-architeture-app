import { z } from "zod/v4";

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginEntity = z.infer<typeof LoginSchema>;
