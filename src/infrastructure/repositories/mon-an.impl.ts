import { MonAnRepository } from "@/domain/repositories/mon-an.repository";
import { HttpClientPort } from "@/application/ports/http-client.port";
import { createGetAllMonAnApi } from "@/infrastructure/api/mon-an/get-all/get-all-mon-an.api";

export function createMonAnRepository(httpClient: HttpClientPort): MonAnRepository {
  return {
    getAll: createGetAllMonAnApi(httpClient),
  };
}
