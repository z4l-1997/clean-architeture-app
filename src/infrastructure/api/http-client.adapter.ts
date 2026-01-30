import {
  HttpClientPort,
  HttpRequestOptions,
} from "@/application/ports/http-client.port";
import { envConfig } from "@/infrastructure/config/env.config";
import { StoragePort } from "@/application/ports/storage.port";
import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";

type HttpClientOptions = {
  storage: StoragePort;
  onUnauthorized?: () => Promise<void>;
};

export function createHttpClient(
  storageOrOptions: StoragePort | HttpClientOptions,
): HttpClientPort {
  const options: HttpClientOptions =
    "get" in storageOrOptions
      ? { storage: storageOrOptions }
      : storageOrOptions;

  const { storage } = options;
  let onUnauthorized = options.onUnauthorized;

  return {
    setOnUnauthorized(callback: () => Promise<void>) {
      onUnauthorized = callback;
    },

    async request<TResponse, TBody = unknown>(
      url: string,
      requestOptions?: HttpRequestOptions<TBody>,
    ): Promise<TResponse> {
      const doFetch = async (): Promise<Response> => {
        const method = requestOptions?.method ?? "GET";
        const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...requestOptions?.headers,
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        return fetch(`${envConfig.API_BASE_URL}${url}`, {
          method,
          headers,
          body: requestOptions?.body
            ? JSON.stringify(requestOptions.body)
            : undefined,
        });
      };

      let response = await doFetch();

      if (response.status === 401 && onUnauthorized) {
        const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          await onUnauthorized();
          response = await doFetch();
        }
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
  };
}
