import { z } from "zod/v4";

export const RefreshTokenSchema = z.object({
  access_token: z.string().min(1, "Access token is required"),
  refresh_token: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenEntity = z.infer<typeof RefreshTokenSchema>;
