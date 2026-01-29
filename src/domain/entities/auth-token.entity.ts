import { z } from "zod/v4";

export const AuthUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthTokenSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  user: AuthUserSchema,
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: AuthTokenSchema,
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthTokenEntity = z.infer<typeof AuthTokenSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
