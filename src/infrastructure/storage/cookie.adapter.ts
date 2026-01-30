import { CookiePort } from "@/application/ports/cookie.port";
import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";
import {
  RefreshResponseSchema,
} from "@/domain/entities/auth-token.entity";

export const cookieAdapter: CookiePort = {
  async setRefreshToken(token: string): Promise<void> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token }),
    });

    if (!res.ok) {
      throw new Error("Failed to set refresh token cookie");
    }
  },

  async refreshTokens(accessToken: string): Promise<AuthTokenEntity> {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to refresh tokens");
    }

    const json = await res.json();
    const parsed = RefreshResponseSchema.parse(json);
    return parsed.data;
  },
};
