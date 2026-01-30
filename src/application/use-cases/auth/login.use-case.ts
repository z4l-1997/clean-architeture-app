/* eslint-disable @typescript-eslint/no-unused-vars */

import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginEntity } from "@/domain/entities/login.entity";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

import { LoginResultDto } from "./dto/login-result.dto";

export async function loginUseCase(
  repo: AuthRepository,
  storage: StoragePort,
  cookie: CookiePort,
  data: LoginEntity,
): Promise<LoginResultDto> {
  const token = await repo.login(data);
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, token.access_token);
  await cookie.setTokens(token.refresh_token, token.access_token);

  const { access_token, refresh_token, token_type, expires_in, ...result } = token;

  return result;
}
