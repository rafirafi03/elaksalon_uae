import { notFound, unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG, logAdminError } from "@/lib/messages";
import ProductForm from "../../product-form";
import { updateProduct } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  await connection();
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit product" />
        <ErrorState description={MSG.unavailable} retryHref="/products" />
      </>
    );
  }

  try {
    const supabase = await getAdminSupabase();
    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

    if (error) {
      logAdminError("products.edit", error);
      return (
        <>
          <PageHeader eyebrow="Catalog" title="Edit product" />
          <ErrorState description={MSG.loadFailed} retryHref="/products" />
        </>
      );
    }

    if (!product) notFound();

    const action = updateProduct.bind(null, id);

    return (
      <>
        <PageHeader
          eyebrow="Catalog"
          title={product.name}
          description="Update details or replace the product image."
        />
        <ProductForm product={product} action={action} submitLabel="Save changes" />
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    logAdminError("products.edit", error);
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit product" />
        <ErrorState description={MSG.loadFailed} retryHref="/products" />
      </>
    );
  }
}
