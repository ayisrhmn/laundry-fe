import { AuthApi } from "./auth/auth-api";
import { UsersApi } from "./users/users-api";

const authApi = new AuthApi();
const usersApi = new UsersApi();

export { authApi, usersApi };
