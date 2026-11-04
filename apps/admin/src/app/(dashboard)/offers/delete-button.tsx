"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteOffer } from "./actions";

export default function DeleteOfferButton({ id, title }: { id: string; title: string }) {
  return <ConfirmDeleteButton itemName={title} itemType="offer" onConfirm={() => deleteOffer(id)} />;
}
