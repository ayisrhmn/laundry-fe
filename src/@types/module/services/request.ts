import { ServiceUnit } from "./response";

export type ServiceRequest = {
  name: string;
  unit: ServiceUnit;
  price: number;
};
