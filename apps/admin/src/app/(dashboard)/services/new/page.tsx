import PageHeader from "@/components/admin/PageHeader";
import ServiceForm from "../service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Add service"
        description="Upload imagery and details for a public service page."
      />
      <ServiceForm action={createService} submitLabel="Create service" />
    </>
  );
}
