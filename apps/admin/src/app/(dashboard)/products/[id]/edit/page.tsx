import { notFound } from "next/navigation";
import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import ErrorState from "@/components/admin/ErrorState";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { MSG } from "@/lib/messages";
import { safeLoad } from "@/lib/safe-load";
import ProductForm from "../../product-form";
import { updateProduct } from "../../actions";

export const instant = false;

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  await connection();
  const { id } = await params;

  const result = isSupabaseConfigured()
    ? await safeLoad("products.edit", async () => {
        const supabase = await getAdminSupabase();
        const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
        if (error) throw error;
        return data;
      })
    : ({ ok: false } as const);

  if (!result.ok) {
    return (
      <>
        <PageHeader eyebrow="Catalog" title="Edit product" />
        <ErrorState description={MSG.loadFailed} retryHref="/products" />
      </>
    );
  }

  const product = result.value;
  if (!product) notFound();

  return (
    <>
      <PageHeader eyebrow="Catalog" title={product.name} description="Update details or replace the product image." />
      <ProductForm product={product} action={updateProduct.bind(null, id)} submitLabel="Save changes" />
    </>
  );
}
