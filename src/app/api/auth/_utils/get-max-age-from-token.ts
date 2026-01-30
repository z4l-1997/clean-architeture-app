export function getMaxAgeFromToken(token: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    if (typeof payload.exp !== "number") {
      throw new Error("Token payload missing 'exp' field");
    }
    const maxAge = payload.exp - Math.floor(Date.now() / 1000);
    if (maxAge <= 0) {
      throw new Error("Token has expired");
    }
    return maxAge;
  } catch (error) {
    throw new Error(
      `Invalid token format: ${error instanceof Error ? error.message : "unable to parse token"}`,
    );
  }
}
