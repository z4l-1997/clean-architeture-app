import { LoginEntity, LoginSchema } from "@/domain/entities/login.entity";
import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";
import {
  LoginResponse,
  LoginResponseSchema,
} from "@/infrastructure/api/auth/_schema/auth-response.schema";
import { HttpClientPort } from "@/application/ports/http-client.port";

export function createLoginApi(httpClient: HttpClientPort) {
  return async function loginApi(data: LoginEntity): Promise<AuthTokenEntity> {
    const parsed = LoginSchema.parse(data);
    const json = await httpClient.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: parsed,
    });
    const result = LoginResponseSchema.parse(json);
    return result.data;
  };
}
