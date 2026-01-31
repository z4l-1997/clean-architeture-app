import { HttpClientPort, HttpRequestOptions } from "@/application/ports/http-client.port";
import { envConfig } from "@/infrastructure/config/env.config";
import { StoragePort } from "@/application/ports/storage.port";
import { CookiePort } from "@/application/ports/cookie.port";

type HttpClientOptions = {
  storage: StoragePort;
  cookie: CookiePort;
  onUnauthorized?: () => Promise<void>;
};

export function createHttpClient(options: HttpClientOptions): HttpClientPort {
  const { cookie } = options;
  let onUnauthorized = options.onUnauthorized;
  let cachedToken: string | null = null;

  async function getToken(): Promise<string | null> {
    if (!cachedToken) {
      cachedToken = await cookie.getAccessToken();
    }
    return cachedToken;
  }

  function clearTokenCache() {
    cachedToken = null;
  }

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
        const token = await getToken();

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
          body: requestOptions?.body ? JSON.stringify(requestOptions.body) : undefined,
        });
      };

      let response = await doFetch();

      if (response.status === 401 && onUnauthorized) {
        clearTokenCache();
        await onUnauthorized();
        cachedToken = await cookie.getAccessToken();
        response = await doFetch();
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
  };
}
