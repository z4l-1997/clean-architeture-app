import { cookies } from "next/headers";
import { getMaxAgeFromToken } from "../_utils/get-max-age-from-token";

export async function POST(req: Request) {
  const { refresh_token, access_token } = await req.json();

  if (!refresh_token) {
    return Response.json(
      { success: false, message: "refresh_token is required" },
      { status: 400 },
    );
  }

  let refreshMaxAge: number;
  try {
    refreshMaxAge = getMaxAgeFromToken(refresh_token);
  } catch (error) {
    return Response.json(
      { success: false, message: (error as Error).message },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: refreshMaxAge,
  });

  if (access_token) {
    try {
      const accessMaxAge = getMaxAgeFromToken(access_token);
      cookieStore.set("access_token", access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: accessMaxAge,
      });
    } catch {
      // access_token invalid/expired — skip setting cookie
    }
  }

  return Response.json({ success: true });
}
