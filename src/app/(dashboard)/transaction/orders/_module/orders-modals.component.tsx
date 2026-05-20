import { Order } from "@/@types/module/orders/response";
import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import { EditOrderStatusesForm, OrderDetailView } from "./orders-forms.component";

export const editOrderStatusesModal = (item: Order, onRefresh?: () => void) =>
  modals({
    id: "edit-order-statuses",
    title: "Ubah Status",
    description: `Ubah status order dan pembayaran untuk pesanan ${item.orderNumber}.`,
    content: ({ close }) => (
      <EditOrderStatusesForm item={item} onRefresh={onRefresh} onClose={close} />
    ),
  });

export const viewOrderModal = (item: Order) =>
  modals({
    id: "view-order",
    title: "Detail Pesanan",
    description: `Detail informasi untuk pesanan ${item.orderNumber}.`,
    content: ({ close }) => <OrderDetailView item={item} onClose={close} />,
  });

export const confirmDeleteOrderModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-order-delete",
    title: "Apakah kamu yakin membatalkan pesanan ini?",
    description: "Pesanan yang dibatalkan tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Batalkan Pesanan"
        />
      );
    },
  });
