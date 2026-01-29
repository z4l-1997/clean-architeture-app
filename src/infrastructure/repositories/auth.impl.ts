import { AuthRepository } from "@/domain/repositories/auth.repository";
import { HttpClientPort } from "@/application/ports/http-client.port";
import { createLoginApi } from "@/infrastructure/api/auth/login/login.api";

export function createAuthRepository(httpClient: HttpClientPort): AuthRepository {
  return {
    login: createLoginApi(httpClient),
  };
}
