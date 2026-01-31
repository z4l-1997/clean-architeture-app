import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";
import { StoragePort } from "@/application/ports/storage.port";
import { AuthUser } from "@/domain/entities/auth-token.entity";

export function getCurrentUserUseCase(storage: StoragePort): AuthUser | null {
  return storage.get<AuthUser>(STORAGE_KEYS.USER_INFOR);
}
