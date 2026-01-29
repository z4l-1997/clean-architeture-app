import { LoginEntity } from "@/domain/entities/login.entity";
import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";

export type AuthRepository = {
  login(data: LoginEntity): Promise<AuthTokenEntity>;
};
