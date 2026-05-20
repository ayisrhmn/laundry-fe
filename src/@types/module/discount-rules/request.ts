import { DiscountType } from "./response";

export type DiscountRuleRequest = {
  name: string;
  minTransaction: number;
  isRepeatable: boolean;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
};
