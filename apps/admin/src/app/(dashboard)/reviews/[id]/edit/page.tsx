import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import ReviewForm from "../../review-form";
import { updateReview } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditReviewPage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("reviews.edit", async () => {
        const supabase = await getAdminSupabase();
        const { data, error } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();
        if (error) throw error;
        return data;
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Content" title="Edit review" />
        <ErrorState description={MSG.loadFailed} retryHref="/reviews" />
      </>
    );
  }

  const review = result.value;
  if (!review) notFound();

  return (
    <>
      <PageHeader eyebrow="Content" title={review.name} description="Update this customer review." />
      <ReviewForm review={review} action={updateReview.bind(null, id)} submitLabel="Save changes" />
    </>
  );
}
