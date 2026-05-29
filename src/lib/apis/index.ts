import { AuthApi } from "./auth/auth-api";
import { CustomersApi } from "./customers/customers-api";
import { DashboardApi } from "./dashboard/dashboard-api";
import { DiscountRulesApi } from "./discount-rules/discount-rules-api";
import { OrdersApi } from "./orders/orders-api";
import { ServicesApi } from "./services/services-api";
import { UsersApi } from "./users/users-api";

const authApi = new AuthApi();
const usersApi = new UsersApi();
const customersApi = new CustomersApi();
const servicesApi = new ServicesApi();
const discountRulesApi = new DiscountRulesApi();
const ordersApi = new OrdersApi();
const dashboardApi = new DashboardApi();

export { authApi, customersApi, dashboardApi, discountRulesApi, ordersApi, servicesApi, usersApi };
