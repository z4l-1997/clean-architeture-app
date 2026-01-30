import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = "/private";
const AUTH_ROUTES = ["/login", "/register"];
const LOGIN_PATH = "/login";
const DEFAULT_PRIVATE_PATH = "/private/menu";

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString();
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp < Math.floor(Date.now() / 1000);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refresh_token")?.value;
  const accessToken = request.cookies.get("access_token")?.value;

  const isPrivateRoute = pathname.startsWith(PRIVATE_ROUTES);
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // --- Private routes: require authentication ---
  if (isPrivateRoute) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }

    // Access token exists and not expired → allow
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.next();
    }

    // Access token missing or expired → try refresh
    return await handleTokenRefresh(request, refreshToken);
  }

  // --- Auth routes: redirect if already logged in ---
  if (isAuthRoute) {
    if (refreshToken && !isTokenExpired(refreshToken)) {
      return NextResponse.redirect(new URL(DEFAULT_PRIVATE_PATH, request.url));
    }
  }

  return NextResponse.next();
}

async function handleTokenRefresh(
  request: NextRequest,
  refreshToken: string,
): Promise<NextResponse> {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

  try {
    const backendRes = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!backendRes.ok) {
      return redirectAndClearCookies(request);
    }

    const data = await backendRes.json();
    const newAccessToken = data.data?.access_token;
    const newRefreshToken = data.data?.refresh_token;

    if (!newAccessToken || !newRefreshToken) {
      return redirectAndClearCookies(request);
    }

    const response = NextResponse.next();

    // Set new access_token cookie (non-HttpOnly so client can read)
    const accessPayload = decodeJwtPayload(newAccessToken);
    const accessMaxAge = accessPayload?.exp
      ? accessPayload.exp - Math.floor(Date.now() / 1000)
      : 60 * 15; // fallback 15 min

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: accessMaxAge,
    });

    // Set new refresh_token cookie (HttpOnly)
    const refreshPayload = decodeJwtPayload(newRefreshToken);
    const refreshMaxAge = refreshPayload?.exp
      ? refreshPayload.exp - Math.floor(Date.now() / 1000)
      : 60 * 60 * 24 * 7; // fallback 7 days

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: refreshMaxAge,
    });

    return response;
  } catch {
    return redirectAndClearCookies(request);
  }
}

function redirectAndClearCookies(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

export const config = {
  matcher: ["/private/:path*", "/login", "/register"],
};
