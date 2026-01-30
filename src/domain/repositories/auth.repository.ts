import { LoginEntity } from "@/domain/entities/login.entity";
import { RefreshTokenEntity } from "@/domain/entities/refresh-token.entity";
import { AuthTokenEntity } from "@/domain/entities/auth-token.entity";

export type AuthRepository = {
  login(data: LoginEntity): Promise<AuthTokenEntity>;
  refresh(data: RefreshTokenEntity): Promise<AuthTokenEntity>;
};
