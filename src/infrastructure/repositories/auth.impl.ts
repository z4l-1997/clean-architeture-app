import { AuthRepository } from "@/domain/repositories/auth.repository";
import { loginApi } from "@/infrastructure/api/auth/login/login.api";

export const authRepository: AuthRepository = {
  login: loginApi,
};
