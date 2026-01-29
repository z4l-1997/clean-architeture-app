import { CookiePort } from "@/application/ports/cookie.port";

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
};
