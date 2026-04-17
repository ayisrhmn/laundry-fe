import { User } from "@/@types/module/users/response";
import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import UserForm from "./user-form.component";

export const formUserModal = (item?: User, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-user" : "create-user",
    title: item?.id ? "Edit User" : "Tambah User",
    description: item?.id
      ? "Edit user disini dengan merubah informasi berikut."
      : "Tambahkan user disini dengan mengisi informasi berikut.",
    content: ({ close }) => <UserForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteUserModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-user-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "User yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Hapus User"
        />
      );
    },
  });
