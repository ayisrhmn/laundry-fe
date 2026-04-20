import { User } from "../users/response";

export type DiscountType = "PERCENTAGE" | "FIXED";

export type DiscountSource = "AUTO" | "MANUAL";

export type DiscountRule = {
  id: string;
  name: string;
  minTransaction: number;
  isRepeatable: boolean;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
};
