import { cookies } from "next/headers";
import { envConfig } from "@/infrastructure/config/env.config";
import { getMaxAgeFromToken } from "../_utils/get-max-age-from-token";
import { STORAGE_KEYS } from "../_constants/storage-keys.constant";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  secure: isProduction,
  sameSite: "strict" as const,
  path: "/",
};

export async function POST(req: Request) {
  const { access_token } = await req.json();

  if (!access_token) {
    return Response.json({ success: false, message: "access_token is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(STORAGE_KEYS.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return Response.json(
      { success: false, message: "refresh_token cookie not found" },
      { status: 401 },
    );
  }

  const backendRes = await fetch(`${envConfig.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!backendRes.ok) {
    return Response.json(
      { success: false, message: "Refresh token failed" },
      { status: backendRes.status },
    );
  }

  const data = await backendRes.json();
  const newRefreshToken = data.data?.refresh_token;
  const newAccessToken = data.data?.access_token;

  if (!newRefreshToken || !newAccessToken) {
    return Response.json(
      { success: false, message: "Invalid response from backend: missing tokens" },
      { status: 502 },
    );
  }

  let refreshMaxAge: number;
  let accessMaxAge: number;
  try {
    refreshMaxAge = getMaxAgeFromToken(newRefreshToken);
    accessMaxAge = getMaxAgeFromToken(newAccessToken);
  } catch (error) {
    return Response.json({ success: false, message: (error as Error).message }, { status: 502 });
  }

  cookieStore.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken, {
    ...baseCookieOptions,
    httpOnly: true,
    maxAge: refreshMaxAge,
  });

  cookieStore.set(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken, {
    ...baseCookieOptions,
    httpOnly: true,
    maxAge: accessMaxAge,
  });

  return Response.json(data);
}
