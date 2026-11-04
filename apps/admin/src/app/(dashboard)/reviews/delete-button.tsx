"use client";

import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteReview } from "./actions";

export default function DeleteReviewButton({ id, title }: { id: string; title: string }) {
  return <ConfirmDeleteButton itemName={title} itemType="review" onConfirm={() => deleteReview(id)} />;
}
