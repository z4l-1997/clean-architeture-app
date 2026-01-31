import { STORAGE_KEYS } from "@/application/constants/storage-keys.constant";
import { StoragePort } from "@/application/ports/storage.port";

export function logoutUseCase(storage: StoragePort): void {
  storage.remove(STORAGE_KEYS.USER_INFOR);
}
