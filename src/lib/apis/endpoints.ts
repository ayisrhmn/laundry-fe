import { generalizeUrls } from "../utils";

export const API_BASE_URL = generalizeUrls(process.env.NEXT_PUBLIC_API_BASE_URL);
export const API_URL = `${API_BASE_URL}/api`;

export const ENDPOINTS = {
  auth: {
    signin: "/auth/user/login",
    signup: "/user/register",
  },
  user: "/user",
  branch: "/branch",
  file: "/file",
  product: "/product",
  productType: "/productType",
  stock: "/stok",
};
