import { generalizeUrls } from "../utils";

export const API_BASE_URL = generalizeUrls(process.env.NEXT_PUBLIC_API_BASE_URL);
export const API_URL = `${API_BASE_URL}/api`;

export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  users: "/users",
  customers: "/customers",
  services: "/services",
  orders: "/orders",
  discountRules: "/discount-rules",
};
