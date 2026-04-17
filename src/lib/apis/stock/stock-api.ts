import { BaseApi } from "../base";
import { CreateStock } from "./stock-schema";

export class StockApi extends BaseApi {
  getStocks() {
    return this.get<BaseApiResult<Stock[]>>({
      url: this.endpoints.stock,
    });
  }

  upsertStock(data: CreateStock & { id?: string }) {
    return this.post<BaseApiResult<Stock>>({
      url: this.endpoints.stock,
      data,
    });
  }
}
