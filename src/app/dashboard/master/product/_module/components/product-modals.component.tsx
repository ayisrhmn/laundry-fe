import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import ProductForm from "./product-form.component";

export const formProductModal = (item?: Product, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-product" : "create-product",
    title: item?.id ? "Edit Produk" : "Tambah Produk",
    description: item?.id
      ? "Edit produk disini dengan merubah informasi berikut."
      : "Tambahkan produk disini dengan mengisi informasi berikut.",
    content: ({ close }) => <ProductForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteProductModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-product-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "Produk yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
    footer({ close }) {
      return (
        <ConfirmationFooter
          close={close}
          requireType={requireType}
          variant="destructive"
          next={async () => {
            await next();
            close();
          }}
          nextText="Hapus Produk"
        />
      );
    },
  });
