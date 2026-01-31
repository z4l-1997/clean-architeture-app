import { localStorageAdapter } from "@/infrastructure/storage/local-storage.adapter";
import { cookieAdapter } from "@/infrastructure/storage/cookie.adapter";
import { createHttpClient } from "@/infrastructure/api/http-client.adapter";
import { createAuthRepository } from "@/infrastructure/repositories/auth.impl";
import { createMonAnRepository } from "@/infrastructure/repositories/mon-an.impl";
import { createAuthContainer } from "./auth.container";
import { createMonAnContainer } from "./mon-an.container";

// 1. Shared dependencies
const storage = localStorageAdapter;
const cookie = cookieAdapter;
const httpClient = createHttpClient({ storage, cookie });

// 2. Repositories Implement
const authRepository = createAuthRepository(httpClient);
const monAnRepository = createMonAnRepository(httpClient);

// 3. Wire up token refresh: on 401, refresh tokens via cookie
httpClient.setOnUnauthorized(async () => {
  const currentToken = await cookie.getAccessToken();
  if (!currentToken) {
    throw new Error("No access token available");
  }

  await cookie.refreshTokens(currentToken);
});

// 4. Namespaced containers
export const authContainer = createAuthContainer(authRepository, storage, cookie);
export const monAnContainer = createMonAnContainer(monAnRepository);
