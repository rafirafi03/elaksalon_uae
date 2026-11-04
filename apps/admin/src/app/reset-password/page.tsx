import type { Metadata } from "next";
import AuthShell from "@/components/admin/AuthShell";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = { title: "Set new password | ELAK Admin" };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a new password" description="Choose a new password for your admin account.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
