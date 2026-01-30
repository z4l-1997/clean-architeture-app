import { cookies } from "next/headers";
import { envConfig } from "@/infrastructure/config/env.config";
import { getMaxAgeFromToken } from "../_utils/get-max-age-from-token";

export async function POST(req: Request) {
  const { access_token } = await req.json();

  if (!access_token) {
    return Response.json(
      { success: false, message: "access_token is required" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

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

  if (newRefreshToken) {
    let maxAge: number;
    try {
      maxAge = getMaxAgeFromToken(newRefreshToken);
    } catch (error) {
      return Response.json(
        { success: false, message: (error as Error).message },
        { status: 502 },
      );
    }

    cookieStore.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge,
    });
  }

  return Response.json(data);
}
