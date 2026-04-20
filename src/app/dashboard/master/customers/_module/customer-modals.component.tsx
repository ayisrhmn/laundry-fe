import { Customer } from "@/@types/module/customers/response";
import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import CustomerForm from "./customer-form.component";

export const formCustomerModal = (item?: Customer, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-customer" : "create-customer",
    title: item?.id ? "Edit Customer" : "Tambah Customer",
    description: item?.id
      ? "Edit customer disini dengan merubah informasi berikut."
      : "Tambahkan customer disini dengan mengisi informasi berikut.",
    content: ({ close }) => <CustomerForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteCustomerModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-customer-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "Customer yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Hapus Customer"
        />
      );
    },
  });
