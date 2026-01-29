"use client";

import { useState } from "react";
import { loginUseCase } from "@/application/use-cases/auth/login.use-case";
import { authRepository } from "@/infrastructure/repositories/auth.impl";
import { localStorageAdapter } from "@/infrastructure/storage/local-storage.adapter";
import { LoginFormState } from "@/presentation/views/login/types/login-form.types";

export function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginFormState) => {
    setError("");
    setLoading(true);

    try {
      const token = await loginUseCase(authRepository, localStorageAdapter, data);
      return token;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
}
