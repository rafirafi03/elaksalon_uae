import { notFound, unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import ReviewForm from "../../review-form";
import { updateReview } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

function Failed() {
  return (
    <>
      <PageHeader eyebrow="Content" title="Edit review" />
      <ErrorState description={MSG.loadFailed} retryHref="/reviews" />
    </>
  );
}

export default async function EditReviewPage({ params }: Params) {
  await connection();
  const { id } = await params;
  if (!isSupabaseConfigured()) return <Failed />;

  try {
    const supabase = await getAdminSupabase();
    const { data: review, error } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();
    if (error) {
      logAdminError("reviews.edit", error);
      return <Failed />;
    }
    if (!review) notFound();

    return (
      <>
        <PageHeader eyebrow="Content" title={review.name} description="Update this customer review." />
        <ReviewForm review={review} action={updateReview.bind(null, id)} submitLabel="Save changes" />
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    logAdminError("reviews.edit", error);
    return <Failed />;
  }
}
