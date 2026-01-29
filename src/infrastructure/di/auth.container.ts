import { LoginEntity } from "@/domain/entities/login.entity";
import { loginUseCase } from "@/application/use-cases/auth/login.use-case";
import { createAuthRepository } from "@/infrastructure/repositories/auth.impl";
import { createHttpClient } from "@/infrastructure/api/http-client.adapter";
import { localStorageAdapter } from "@/infrastructure/storage/local-storage.adapter";
import { cookieAdapter } from "@/infrastructure/storage/cookie.adapter";

const httpClient = createHttpClient(localStorageAdapter);
const authRepository = createAuthRepository(httpClient);

export function executeLogin(data: LoginEntity) {
  return loginUseCase(authRepository, localStorageAdapter, cookieAdapter, data);
}
