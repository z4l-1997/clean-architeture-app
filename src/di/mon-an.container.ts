import { MonAnRepository } from "@/domain/repositories/mon-an.repository";
import { getAllMonAnUseCase } from "@/application/use-cases/mon-an/get-all-mon-an.use-case";

export function createMonAnContainer(repo: MonAnRepository) {
  return {
    executeGetAllMonAn: () => getAllMonAnUseCase(repo),
  };
}

export type MonAnContainer = ReturnType<typeof createMonAnContainer>;
