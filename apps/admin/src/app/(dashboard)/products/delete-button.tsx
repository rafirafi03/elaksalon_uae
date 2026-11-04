"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteProduct } from "./actions";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} itemType="product" onConfirm={() => deleteProduct(id)} />;
}
