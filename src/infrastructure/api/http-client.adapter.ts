import {
  HttpClientPort,
  HttpRequestOptions,
} from "@/application/ports/http-client.port";
import { envConfig } from "@/infrastructure/config/env.config";
import { StoragePort } from "@/application/ports/storage.port";

const ACCESS_TOKEN_KEY = "access_token";

export function createHttpClient(storage: StoragePort): HttpClientPort {
  return {
    async request<TResponse, TBody = unknown>(
      url: string,
      options?: HttpRequestOptions<TBody>,
    ): Promise<TResponse> {
      const method = options?.method ?? "GET";
      const token = storage.get<string>(ACCESS_TOKEN_KEY);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${envConfig.API_BASE_URL}${url}`, {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
  };
}
