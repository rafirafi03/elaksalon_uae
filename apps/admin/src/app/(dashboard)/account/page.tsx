import { connection } from "next/server";
import PageHeader from "@/components/admin/PageHeader";
import { getAdminSupabase, isSupabaseConfigured } from "@/lib/supabase";
import ChangePasswordForm from "./change-password-form";
import OptimizeImages from "./optimize-images";

export const instant = false;

export default async function AccountPage() {
  await connection();
  let email = "";
  if (isSupabaseConfigured()) {
    const supabase = await getAdminSupabase();
    const { data } = await supabase.auth.getClaims();
    email = (data?.claims?.email as string | undefined) ?? "";
  }

  return (
    <>
      <PageHeader eyebrow="Settings" title="Account" description={email ? `Signed in as ${email}` : undefined} />
      <div className="space-y-6">
        <ChangePasswordForm />
        <OptimizeImages />
      </div>
    </>
  );
}
