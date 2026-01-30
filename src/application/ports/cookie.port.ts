import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";

export type CookiePort = {
  setRefreshToken(token: string): Promise<void>;
  refreshTokens(accessToken: string): Promise<AuthTokenEntity>;
};
