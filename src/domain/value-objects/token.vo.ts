import { z } from "zod/v4";

export const TokenSchema = z.string().min(1, "Token must not be empty");

export type Token = z.infer<typeof TokenSchema>;
