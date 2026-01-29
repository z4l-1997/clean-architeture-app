import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginEntity } from "@/domain/entities/login.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";

const ACCESS_TOKEN_KEY = "access_token";

export async function loginUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: LoginEntity,
) {
  const token = await repo.login(data);
  storage.set(ACCESS_TOKEN_KEY, token.access_token);
  await cookie.setRefreshToken(token.refresh_token);
  return token;
}
