type Stock = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  quantity: string;
  product: Product;
  branch: Branch;
  __entity: "Stock";
};
