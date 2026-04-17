interface Branch {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  code: string;
  name: string;
  address: string;
  user: User;
  __entity: "Branch";
}
