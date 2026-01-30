import { z } from "zod/v4";
import { AuthTokenSchema } from "@/domain/entities/auth-token.entity";

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: AuthTokenSchema,
});

export const RefreshResponseSchema = LoginResponseSchema;

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
