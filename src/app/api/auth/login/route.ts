import { cookies } from "next/headers";
import { getMaxAgeFromToken } from "../_utils/get-max-age-from-token";

export async function POST(req: Request) {
  const { refresh_token } = await req.json();

  if (!refresh_token) {
    return Response.json(
      { success: false, message: "refresh_token is required" },
      { status: 400 },
    );
  }

  let maxAge: number;
  try {
    maxAge = getMaxAgeFromToken(refresh_token);
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
    maxAge,
  });

  return Response.json({ success: true });
}
