import Link from "next/link";
import { connection } from "next/server";
import { Plus, Star } from "lucide-react";
import type { ReviewRow } from "@elak/db";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import DeleteReviewButton from "./delete-button";
import SortableTable from "@/components/admin/SortableTable";
import { bulkDeleteReviews, reorderReviews } from "./actions";
import GoogleLinkForm from "./google-link-form";

export const instant = false;

export default async function AdminReviewsPage() {
  await connection();

  let reviews: ReviewRow[] = [];
  let googleReviewsUrl = "";
  let failed = false;

  if (!isSupabaseConfigured()) {
    failed = true;
  } else {
    try {
      const supabase = await getAdminSupabase();
      const { data: company } = await supabase
        .from("company_settings")
        .select("google_reviews_url")
        .eq("id", 1)
        .maybeSingle();
      googleReviewsUrl = company?.google_reviews_url ?? "";
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) {
        logAdminError("reviews.list", error);
        failed = true;
      } else {
        reviews = data ?? [];
      }
    } catch (error) {
      logAdminError("reviews.list", error);
      failed = true;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Content"
        title="Reviews"
        description="Customer reviews shown in the carousel on the home page."
        action={
          <Link
            href="/reviews/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
          >
            <Plus size={16} />
            Add review
          </Link>
        }
      />

      {!failed ? <GoogleLinkForm defaultValue={googleReviewsUrl} /> : null}

      {failed ? <ErrorState description={MSG.loadFailed} retryHref="/reviews" /> : null}

      {!failed && reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Add customer reviews to show them on the public site."
          actionHref="/reviews/new"
          actionLabel="Add review"
        />
      ) : null}

      {!failed && reviews.length > 0 ? (
        <SortableTable
          itemType="review"
          itemTypePlural="reviews"
          onReorder={reorderReviews}
          onBulkDelete={bulkDeleteReviews}
          columns={[
            { label: "Customer" },
            { label: "Rating" },
            { label: "Review", className: "max-w-sm" },
            { label: "Status" },
            { label: "Actions", className: "pr-5 text-right" },
          ]}
          rows={reviews.map((review) => ({
            id: review.id,
            label: review.name,
            cells: [
              <div key="c" className="flex items-center gap-3">
                {review.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={review.image_url} alt="" className="h-10 w-10 rounded-full bg-surface object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-serif text-gold">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div>
                  <div className="font-serif text-base whitespace-nowrap text-cream">{review.name}</div>
                  {review.role ? <div className="text-xs text-muted">{review.role}</div> : null}
                </div>
              </div>,
              <span key="r" className="inline-flex items-center gap-1 text-gold">
                <Star size={14} className="fill-gold" />
                {review.rating}
              </span>,
              <p key="t" className="line-clamp-2 text-xs text-muted">
                {review.comment}
              </p>,
              <span
                key="s"
                className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
                  review.is_published ? "bg-gold text-background" : "bg-surface text-muted"
                }`}
              >
                {review.is_published ? "Published" : "Hidden"}
              </span>,
              <div key="a" className="flex items-center justify-end gap-4">
                <Link href={`/reviews/${review.id}/edit`} className="text-sm text-gold transition hover:text-gold-soft">
                  Edit
                </Link>
                <DeleteReviewButton id={review.id} title={review.name} />
              </div>,
            ],
          }))}
        />
      ) : null}
    </>
  );
}
