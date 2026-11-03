import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "../product-form";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Add product"
        description="Upload imagery and details in the same visual language as the public store."
      />
      <ProductForm action={createProduct} submitLabel="Create product" />
    </>
  );
}
