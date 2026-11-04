"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteSpecialist } from "./actions";

export default function DeleteSpecialistButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} itemType="specialist" onConfirm={() => deleteSpecialist(id)} />;
}
