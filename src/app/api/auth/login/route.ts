import { cookies } from "next/headers";
import { getMaxAgeFromToken } from "../_utils/get-max-age-from-token";
import { STORAGE_KEYS } from "../_constants/storage-keys.constant";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  secure: isProduction,
  sameSite: "strict" as const,
  path: "/",
};

export async function POST(req: Request) {
  const { refresh_token, access_token } = await req.json();

  if (!refresh_token) {
    return Response.json({ success: false, message: "refresh_token is required" }, { status: 400 });
  }

  if (!access_token) {
    return Response.json({ success: false, message: "access_token is required" }, { status: 400 });
  }

  let refreshMaxAge: number;
  let accessMaxAge: number;
  try {
    refreshMaxAge = getMaxAgeFromToken(refresh_token);
    accessMaxAge = getMaxAgeFromToken(access_token);
  } catch (error) {
    return Response.json({ success: false, message: (error as Error).message }, { status: 400 });
  }

  const cookieStore = await cookies();

  cookieStore.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token, {
    ...baseCookieOptions,
    httpOnly: true,
    maxAge: refreshMaxAge,
  });

  cookieStore.set(STORAGE_KEYS.ACCESS_TOKEN, access_token, {
    ...baseCookieOptions,
    httpOnly: true,
    maxAge: accessMaxAge,
  });

  return Response.json({ success: true });
}
