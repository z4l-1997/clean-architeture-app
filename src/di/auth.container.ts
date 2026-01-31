import { LoginEntity } from "@/domain/entities/login.entity";
import { RefreshTokenEntity } from "@/domain/entities/refresh-token.entity";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { loginUseCase } from "@/application/use-cases/auth/login.use-case";
import { refreshUseCase } from "@/application/use-cases/auth/refresh.use-case";
import { getCurrentUserUseCase } from "@/application/use-cases/auth/get-current-user.use-case";
import { logoutUseCase } from "@/application/use-cases/auth/logout.use-case";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";

export function createAuthContainer(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
) {
  return {
    executeLogin: (data: LoginEntity) => loginUseCase(repo, storage, cookie, data),
    executeRefresh: (data: RefreshTokenEntity) => refreshUseCase(repo, storage, cookie, data),
    logout: () => logoutUseCase(storage),
    getCurrentUser: getCurrentUserUseCase(storage),
  };
}

export type AuthContainer = ReturnType<typeof createAuthContainer>;
