import { z } from "zod/v4";

export const EmailSchema = z.email("Invalid email format");

export type Email = z.infer<typeof EmailSchema>;
