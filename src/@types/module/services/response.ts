import { User } from "../users/response";

export type ServiceUnit = "KG" | "ITEM";

export type Service = {
  id: string;
  name: string;
  unit: ServiceUnit;
  price: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
};
