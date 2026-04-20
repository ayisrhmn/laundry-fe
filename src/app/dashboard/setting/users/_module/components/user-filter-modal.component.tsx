"use client";

import { modals } from "@/hooks/use-modals";
import { UserFilterForm } from "./user-filter-form.component";

export type UsersFilterValues = {
  sort: "newest" | "oldest";
  role?: "ADMIN" | "OPERATOR";
};

export const filterUsersModal = (
  values: UsersFilterValues,
  onApply: (values: UsersFilterValues) => void,
) =>
  modals({
    id: "filter-users",
    title: "Filter",
    description: "Filter data user sesuai kebutuhan kamu.",
    content: ({ close }) => <UserFilterForm values={values} onApply={onApply} onClose={close} />,
  });
