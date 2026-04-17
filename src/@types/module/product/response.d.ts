type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

type Product = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  sku: string;
  price: string;
  description: string;
  status: ProductStatus;
  type: ProductType;
  __entity: "Product";
};
