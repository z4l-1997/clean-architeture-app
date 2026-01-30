import { localStorageAdapter } from "@/infrastructure/storage/local-storage.adapter";
import { cookieAdapter } from "@/infrastructure/storage/cookie.adapter";
import { createHttpClient } from "@/infrastructure/api/http-client.adapter";
import { createAuthRepository } from "@/infrastructure/repositories/auth.impl";
import { createAuthContainer } from "./auth.container";

// 1. Shared dependencies
const storage = localStorageAdapter;
const cookie = cookieAdapter;
const httpClient = createHttpClient(storage);

// 2. Repositories Implement
const authRepository = createAuthRepository(httpClient);

// 3. Namespaced containers
export const authContainer = createAuthContainer(authRepository, storage, cookie);
