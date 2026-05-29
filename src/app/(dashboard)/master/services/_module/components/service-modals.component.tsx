import { Service } from "@/@types/module/services/response";
import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import { ServiceFilterForm } from "./service-filter-form.component";
import ServiceForm from "./service-form.component";

export type ServicesFilterValues = {
  sort: "newest" | "oldest";
};

export const formServiceModal = (item?: Service, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-service" : "create-service",
    title: item?.id ? "Edit Layanan" : "Tambah Layanan",
    description: item?.id
      ? "Edit layanan disini dengan merubah informasi berikut."
      : "Tambahkan layanan disini dengan mengisi informasi berikut.",
    content: ({ close }) => <ServiceForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteServiceModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-service-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "Layanan yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Hapus Layanan"
        />
      );
    },
  });

export const filterServicesModal = (
  values: ServicesFilterValues,
  onApply: (values: ServicesFilterValues) => void,
) =>
  modals({
    id: "filter-services",
    title: "Filter",
    description: "Filter data layanan sesuai kebutuhan kamu.",
    content: ({ close }) => <ServiceFilterForm values={values} onApply={onApply} onClose={close} />,
  });
