import { z } from "zod/v4";

export const MonAnSchema = z.object({
  id: z.string(),
  ten: z.string(),
  gia: z.number(),
  gia_sau_giam: z.number(),
  mo_ta: z.string(),
  con_hang: z.boolean(),
  giam_gia: z.number(),
  co_the_ban: z.boolean(),
  ngay_tao: z.string(),
  ngay_cap_nhat: z.string(),
});

export type MonAnEntity = z.infer<typeof MonAnSchema>;
