import { DiscountRule, DiscountType } from "@/@types/module/discount-rules/response";
import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import { DiscountRuleFilterForm } from "./discount-rule-filter-form.component";
import DiscountRuleForm from "./discount-rule-form.component";

export type DiscountRulesFilterValues = {
  sort: "newest" | "oldest";
  discountType?: DiscountType;
};

export const formDiscountRuleModal = (item?: DiscountRule, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-discount-rule" : "create-discount-rule",
    title: item?.id ? "Edit Aturan Diskon" : "Tambah Aturan Diskon",
    description: item?.id
      ? "Edit aturan diskon disini dengan merubah informasi berikut."
      : "Tambahkan aturan diskon baru disini dengan mengisi informasi berikut.",
    content: ({ close }) => <DiscountRuleForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteDiscountRuleModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-discount-rule-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "Aturan diskon yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
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
          nextText="Hapus Aturan Diskon"
        />
      );
    },
  });

export const filterDiscountRulesModal = (
  values: DiscountRulesFilterValues,
  onApply: (values: DiscountRulesFilterValues) => void,
) =>
  modals({
    id: "filter-discount-rules",
    title: "Filter",
    description: "Filter data aturan diskon sesuai kebutuhan kamu.",
    content: ({ close }) => <DiscountRuleFilterForm values={values} onApply={onApply} onClose={close} />,
  });
