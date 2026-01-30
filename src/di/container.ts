import { localStorageAdapter } from "@/infrastructure/storage/local-storage.adapter";
import { cookieAdapter } from "@/infrastructure/storage/cookie.adapter";
import { createHttpClient } from "@/infrastructure/api/http-client.adapter";
import { createAuthRepository } from "@/infrastructure/repositories/auth.impl";
import { createMonAnRepository } from "@/infrastructure/repositories/mon-an.impl";
import { createAuthContainer } from "./auth.container";
import { createMonAnContainer } from "./mon-an.container";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

// 1. Shared dependencies
const storage = localStorageAdapter;
const cookie = cookieAdapter;
const httpClient = createHttpClient(storage);

// 2. Repositories Implement
const authRepository = createAuthRepository(httpClient);
const monAnRepository = createMonAnRepository(httpClient);

// 3. Wire up token refresh: on 401, refresh tokens and update storage
httpClient.setOnUnauthorized(async () => {
  const currentToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  if (!currentToken) {
    throw new Error("No access token available");
  }

  const tokenData = await cookie.refreshTokens(currentToken);
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokenData.access_token);
});

// 4. Namespaced containers
export const authContainer = createAuthContainer(authRepository, storage, cookie);
export const monAnContainer = createMonAnContainer(monAnRepository);
