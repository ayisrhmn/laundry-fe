import { AuthApi } from "@/lib/apis/auth/auth-api";
import { BranchApi } from "./branch/branch-api";
import { ProductTypeApi } from "./product-type/product-type-api";
import { ProductApi } from "./product/product-api";
import { StockApi } from "./stock/stock-api";

const authApi = new AuthApi();
const branchApi = new BranchApi();
const productTypeApi = new ProductTypeApi();
const productApi = new ProductApi();
const stockAPi = new StockApi();

export { authApi, branchApi, productApi, productTypeApi, stockAPi };
