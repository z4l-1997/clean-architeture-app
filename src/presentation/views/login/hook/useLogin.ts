"use client";

import { useState } from "react";
import { useAuthContext } from "@/presentation/providers/auth.provider";
import { LoginFormState } from "@/presentation/views/login/types/login-form.types";

export function useLogin() {
  const { login: executeLogin } = useAuthContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginFormState) => {
    setError("");
    setLoading(true);

    try {
      const token = await executeLogin(data);
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
