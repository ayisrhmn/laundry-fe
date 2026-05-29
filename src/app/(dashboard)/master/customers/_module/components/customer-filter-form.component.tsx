"use client";

import { FlexibleSelect } from "@/components/base/app-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CustomersFilterValues } from "./customer-modals.component";

export function CustomerFilterForm({
  values,
  onApply,
  onClose,
}: {
  values: CustomersFilterValues;
  onApply: (values: CustomersFilterValues) => void;
  onClose: () => void;
}) {
  const [sort, setSort] = useState<"newest" | "oldest">(values.sort);

  const handleApply = () => {
    onApply({ sort });
    onClose();
  };

  const handleReset = () => {
    setSort("newest");
    onApply({ sort: "newest" });
    onClose();
  };

  return (
    <div className="py-2 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full space-y-2">
          <Label>Urutan</Label>
          <FlexibleSelect
            placeholder="Pilih urutan"
            options={[
              { value: "newest", label: "Terbaru" },
              { value: "oldest", label: "Terlama" },
            ]}
            value={sort}
            onValueChange={(value) => setSort(value as "newest" | "oldest")}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end space-x-2 mt-6!">
        <Button variant="outline" onClick={handleReset} type="button">
          Reset
        </Button>
        <Button onClick={handleApply}>Terapkan</Button>
      </div>
    </div>
  );
}
