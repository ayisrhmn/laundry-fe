"use client";

import { modals } from "@/hooks/use-modals";
import { CustomerFilterForm } from "./customer-filter-form.component";

export type CustomersFilterValues = {
  sort: "newest" | "oldest";
};

export const filterCustomersModal = (
  values: CustomersFilterValues,
  onApply: (values: CustomersFilterValues) => void,
) =>
  modals({
    id: "filter-customers",
    title: "Filter",
    description: "Filter data customer sesuai kebutuhan kamu.",
    content: ({ close }) => (
      <CustomerFilterForm values={values} onApply={onApply} onClose={close} />
    ),
  });
