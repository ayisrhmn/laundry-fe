import { AuthApi } from "./auth/auth-api";
import { CustomersApi } from "./customers/customers-api";
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

export { authApi, customersApi, discountRulesApi, ordersApi, servicesApi, usersApi };
