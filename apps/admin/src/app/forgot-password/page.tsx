import type { Metadata } from "next";
import AuthShell from "@/components/admin/AuthShell";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = { title: "Forgot password | ELAK Admin" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password" description="Enter your admin email and we'll send you a link to reset it.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
