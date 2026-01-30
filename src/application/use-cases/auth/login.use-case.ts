import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginEntity } from "@/domain/entities/login.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

export async function loginUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: LoginEntity,
) {
  const token = await repo.login(data);
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, token.access_token);
  await cookie.setRefreshToken(token.refresh_token);
  return token;
}
