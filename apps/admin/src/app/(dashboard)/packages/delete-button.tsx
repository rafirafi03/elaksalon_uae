"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deletePackage } from "./actions";

export default function DeletePackageButton({ id, title }: { id: string; title: string }) {
  return <ConfirmDeleteButton itemName={title} itemType="package" onConfirm={() => deletePackage(id)} />;
}
