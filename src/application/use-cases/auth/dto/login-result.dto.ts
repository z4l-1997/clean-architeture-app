import { AuthUser } from "@/domain/entities/auth-token.entity";

export interface LoginResultDto {
  user: AuthUser;
}
