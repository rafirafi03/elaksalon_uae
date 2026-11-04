import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/admin/AuthShell";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Sign in | ELAK Admin" };

export default function LoginPage() {
  return (
    <AuthShell title="Sign in" description="Admins only. Use the account added in Supabase.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
