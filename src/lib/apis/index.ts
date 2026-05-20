import { AuthApi } from "./auth/auth-api";
import { CustomersApi } from "./customers/customers-api";
import { DiscountRulesApi } from "./discount-rules/discount-rules-api";
import { ServicesApi } from "./services/services-api";
import { UsersApi } from "./users/users-api";

const authApi = new AuthApi();
const usersApi = new UsersApi();
const customersApi = new CustomersApi();
const servicesApi = new ServicesApi();
const discountRulesApi = new DiscountRulesApi();

export { authApi, customersApi, servicesApi, usersApi, discountRulesApi };
