import { AuthRepository } from "@/domain/repositories/auth.repository";
import { RefreshTokenEntity } from "@/domain/entities/refresh-token.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";

const ACCESS_TOKEN_KEY = "access_token";

export async function refreshUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: RefreshTokenEntity,
) {
  const token = await repo.refresh(data);
  storage.set(ACCESS_TOKEN_KEY, token.access_token);
  await cookie.setRefreshToken(token.refresh_token);
  return token;
}
