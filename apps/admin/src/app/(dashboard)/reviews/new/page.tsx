import PageHeader from "@/components/admin/PageHeader";
import ReviewForm from "../review-form";
import { createReview } from "../actions";

export default function NewReviewPage() {
  return (
    <>
      <PageHeader eyebrow="Content" title="Add review" description="Add a customer review for the home page carousel." />
      <ReviewForm action={createReview} submitLabel="Create review" />
    </>
  );
}
