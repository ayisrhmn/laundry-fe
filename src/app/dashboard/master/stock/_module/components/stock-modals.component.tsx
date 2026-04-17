import { modals } from "@/hooks/use-modals";
import StockForm from "./stock-form.component";

export const formStockModal = (item?: Stock, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-stock" : "create-stock",
    title: item?.id ? "Edit Stok" : "Tambah Stok",
    description: item?.id
      ? "Edit stok disini dengan merubah informasi berikut."
      : "Tambahkan stok disini dengan mengisi informasi berikut.",
    content: ({ close }) => <StockForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};
