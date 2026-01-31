import { AuthRepository } from "@/domain/repositories/auth.repository";
import { RefreshTokenEntity } from "@/domain/entities/refresh-token.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";
import { AuthUser } from "@/domain/entities/auth-token.entity";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

export async function refreshUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: RefreshTokenEntity,
) {
  const token = await repo.refresh(data);
  await cookie.setTokens(token.refresh_token, token.access_token);
  storage.set<AuthUser>(STORAGE_KEYS.USER_INFOR, token.user);
  return token;
}
