export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpRequestOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
};

export type HttpClientPort = {
  request<TResponse, TBody = unknown>(
    url: string,
    options?: HttpRequestOptions<TBody>,
  ): Promise<TResponse>;
};
