import { z } from "zod/v4";
import { EmailSchema } from "@/domain/value-objects/email.vo";
import { UserRoleSchema } from "@/domain/value-objects/user-role.vo";
import { TokenSchema } from "@/domain/value-objects/token.vo";

export const AuthUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: EmailSchema,
  role: UserRoleSchema,
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthTokenSchema = z.object({
  access_token: TokenSchema,
  refresh_token: TokenSchema,
  token_type: z.string(),
  expires_in: z.number(),
  user: AuthUserSchema,
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: AuthTokenSchema,
});

export const RefreshResponseSchema = LoginResponseSchema;

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthTokenEntity = z.infer<typeof AuthTokenSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
