import { CookiePort } from "@/application/ports/cookie.port";
import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";
import { RefreshResponseSchema } from "@/infrastructure/api/auth/_schema/auth-response.schema";

export const cookieAdapter: CookiePort = {
  async getAccessToken(): Promise<string | null> {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.access_token ?? null;
  },

  async setTokens(refreshToken: string, accessToken: string): Promise<void> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken, access_token: accessToken }),
    });

    if (!res.ok) {
      throw new Error("Failed to set token cookies");
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
