import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginEntity } from "@/domain/entities/login.entity";
import { StoragePort } from "@/application/ports/storage.port";

const ACCESS_TOKEN_KEY = "access_token";

export async function loginUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  data: LoginEntity,
) {
  const token = await repo.login(data);
  storage.set(ACCESS_TOKEN_KEY, token.access_token);
  return token;
}
