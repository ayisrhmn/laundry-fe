import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import BranchForm from "./branch-form.component";

export const formBranchModal = (item?: Branch, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-branch" : "create-branch",
    title: item?.id ? "Edit Cabang" : "Tambah Cabang",
    description: item?.id
      ? "Edit cabang disini dengan merubah informasi berikut."
      : "Tambahkan cabang disini dengan mengisi informasi berikut.",
    content: ({ close }) => <BranchForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteBranchModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-branch-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "Cabang yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Hapus Cabang"
        />
      );
    },
  });
