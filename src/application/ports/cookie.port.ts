import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";

export type CookiePort = {
  getAccessToken(): Promise<string | null>;
  setTokens(refreshToken: string, accessToken: string): Promise<void>;
  refreshTokens(accessToken: string): Promise<AuthTokenEntity>;
};
