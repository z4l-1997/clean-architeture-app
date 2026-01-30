import { AuthRepository } from "@/domain/repositories/auth.repository";
import { RefreshTokenEntity } from "@/domain/entities/refresh-token.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

export async function refreshUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: RefreshTokenEntity,
) {
  const token = await repo.refresh(data);
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, token.access_token);
  await cookie.setTokens(token.refresh_token, token.access_token);
  return token;
}
