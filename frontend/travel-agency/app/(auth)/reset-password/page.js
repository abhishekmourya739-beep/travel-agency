import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
