import { MonAnEntity } from "@/domain/entities/mon-an.entity";
import { HttpClientPort } from "@/application/ports/http-client.port";
import {
  GetAllMonAnResponse,
  GetAllMonAnResponseSchema,
} from "@/infrastructure/api/mon-an/_schema/mon-an-response.schema";

export function createGetAllMonAnApi(httpClient: HttpClientPort) {
  return async function getAllMonAnApi(): Promise<MonAnEntity[]> {
    const json = await httpClient.request<GetAllMonAnResponse>("/mon-an");
    const result = GetAllMonAnResponseSchema.parse(json);
    return result.data;
  };
}
