/* eslint-disable @typescript-eslint/no-unused-vars */

import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginEntity } from "@/domain/entities/login.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";

import { LoginResultDto } from "./dto/login-result.dto";
import { AuthUser } from "@/domain/entities/auth-token.entity";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

export async function loginUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: LoginEntity,
): Promise<LoginResultDto> {
  const token = await repo.login(data);
  await cookie.setTokens(token.refresh_token, token.access_token);
  storage.set<AuthUser>(STORAGE_KEYS.USER_INFOR, token.user);
  const { access_token, refresh_token, token_type, expires_in, ...result } = token;

  return result;
}
