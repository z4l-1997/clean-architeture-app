import { z } from "zod/v4";

export const UserRoleSchema = z.enum(["customer", "staff", "manager", "admin"]);

export type UserRole = z.infer<typeof UserRoleSchema>;
