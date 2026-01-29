import { cookies } from "next/headers";

function getMaxAgeFromToken(token: string): number {
  const fallback = 7 * 24 * 60 * 60;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    if (typeof payload.exp === "number") {
      const maxAge = payload.exp - Math.floor(Date.now() / 1000);
      return maxAge > 0 ? maxAge : fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export async function POST(req: Request) {
  const { refresh_token } = await req.json();

  if (!refresh_token) {
    return Response.json(
      { success: false, message: "refresh_token is required" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getMaxAgeFromToken(refresh_token),
  });

  return Response.json({ success: true });
}
