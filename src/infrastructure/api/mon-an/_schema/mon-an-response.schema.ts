import { MonAnSchema } from "@/domain/entities/mon-an.entity";
import { z } from "zod/v4";

export const GetAllMonAnResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(MonAnSchema),
});

export type GetAllMonAnResponse = z.infer<typeof GetAllMonAnResponseSchema>;
