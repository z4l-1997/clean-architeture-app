import { RefreshTokenEntity, RefreshTokenSchema } from "@/domain/entities/refresh-token.entity";
import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";
import {
  RefreshResponse,
  RefreshResponseSchema,
} from "@/infrastructure/api/auth/_schema/auth-response.schema";
import { HttpClientPort } from "@/application/ports/http-client.port";

export function createRefreshApi(httpClient: HttpClientPort) {
  return async function refreshApi(data: RefreshTokenEntity): Promise<AuthTokenEntity> {
    const parsed = RefreshTokenSchema.parse(data);
    const json = await httpClient.request<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: parsed,
    });
    const result = RefreshResponseSchema.parse(json);
    return result.data;
  };
}
