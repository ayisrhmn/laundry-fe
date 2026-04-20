import { User } from "../users/response";

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  transactionCount: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
};
