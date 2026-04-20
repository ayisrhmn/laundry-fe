import { AuthApi } from "./auth/auth-api";
import { CustomersApi } from "./customers/customers-api";
import { ServicesApi } from "./services/services-api";
import { UsersApi } from "./users/users-api";

const authApi = new AuthApi();
const usersApi = new UsersApi();
const customersApi = new CustomersApi();
const servicesApi = new ServicesApi();

export { authApi, customersApi, servicesApi, usersApi };
