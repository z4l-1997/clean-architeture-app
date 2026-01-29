import { LoginEntity, LoginSchema } from "@/domain/entities/login.entity";
import {
  AuthTokenEntity,
  LoginResponseSchema,
} from "@/domain/entities/auth-token.entity";
import { envConfig } from "@/infrastructure/config/env.config";

export async function loginApi(data: LoginEntity): Promise<AuthTokenEntity> {
  const parsed = LoginSchema.parse(data);

  const response = await fetch(`${envConfig.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(parsed),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const json = await response.json();
  const result = LoginResponseSchema.parse(json);
  return result.data;
}
