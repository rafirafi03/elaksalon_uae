"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteCategory } from "./actions";

export default function DeleteCategoryButton({
  id,
  name,
  serviceCount,
}: {
  id: string;
  name: string;
  serviceCount: number;
}) {
  return (
    <ConfirmDeleteButton
      itemName={name}
      itemType="category"
      message={
        <>
          <span className="font-medium text-cream">“{name}”</span> will be permanently deleted.
          {serviceCount > 0
            ? ` Its ${serviceCount} service${serviceCount === 1 ? "" : "s"} will stay, but without a category.`
            : ""}{" "}
          This cannot be undone.
        </>
      }
      onConfirm={() => deleteCategory(id)}
    />
  );
}
