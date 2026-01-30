import { MonAnEntity } from "@/domain/entities/mon-an.entity";

export type MonAnRepository = {
  getAll(): Promise<MonAnEntity[]>;
};
