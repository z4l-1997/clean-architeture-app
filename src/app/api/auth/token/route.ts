import { cookies } from "next/headers";
import { STORAGE_KEYS } from "../_constants/storage-keys.constant";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(STORAGE_KEYS.ACCESS_TOKEN)?.value ?? null;

  return Response.json({ access_token: accessToken });
}
