import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import ProductTypeForm from "./product-type-form.component";

export const formProductTypeModal = (item?: ProductType, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-product-type" : "create-product-type",
    title: item?.id ? "Edit Kategori Produk" : "Tambah Kategori Produk",
    description: item?.id
      ? "Edit kategori produk disini dengan merubah informasi berikut."
      : "Tambahkan kategori produk disini dengan mengisi informasi berikut.",
    content: ({ close }) => <ProductTypeForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteProductTypeModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-product-type-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description:
      "Kategori produk yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Hapus Kategori Produk"
        />
      );
    },
  });
