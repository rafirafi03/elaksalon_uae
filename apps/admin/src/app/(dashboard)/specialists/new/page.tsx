import PageHeader from "@/components/admin/PageHeader";
import SpecialistForm from "../specialist-form";
import { createSpecialist } from "../actions";

export default function NewSpecialistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Add specialist"
        description="Upload a portrait and fill in role, specialty, and skills."
      />
      <SpecialistForm action={createSpecialist} submitLabel="Create specialist" />
    </>
  );
}
