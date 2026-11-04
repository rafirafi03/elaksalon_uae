"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteService } from "./actions";

export default function DeleteServiceButton({ id, title }: { id: string; title: string }) {
  return <ConfirmDeleteButton itemName={title} itemType="service" onConfirm={() => deleteService(id)} />;
}
