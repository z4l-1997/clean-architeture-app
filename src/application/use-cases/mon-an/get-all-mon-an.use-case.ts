import { MonAnRepository } from "@/domain/repositories/mon-an.repository";
import { MonAnEntity } from "@/domain/entities/mon-an.entity";

export async function getAllMonAnUseCase(
  repo: MonAnRepository,
): Promise<MonAnEntity[]> {
  return repo.getAll();
}
