"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  KeyRound,
  Mail,
  ArrowRight,
  RefreshCcw,
  LockKeyhole,
} from "lucide-react";

import AuthLayout from "./authLayout";
import { resetPassword } from "@/lib/api/auth";
import PasswordInput from "../global/passwordInput";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    const storedEmail = sessionStorage.getItem("resetEmail");
    const storedToken = sessionStorage.getItem("resetToken");

    if (!storedEmail || !storedToken) {
      router.replace("/forgot-password");
      return;
    }

    if (queryEmail && queryEmail !== storedEmail) {
      router.replace("/forgot-password");
      return;
    }

    setEmail(storedEmail);
    setResetToken(storedToken);
    setCheckingAccess(false);
  }, [router, searchParams]);

  const resetPasswordSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleChangeEmail = () => {
    sessionStorage.removeItem("resetEmail");
    sessionStorage.removeItem("resetToken");
    router.push("/forgot-password");
  };

  if (checkingAccess) {
    return (
      <AuthLayout>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Checking reset access
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Please wait while we verify your password reset session.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
          <KeyRound className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          Set New Password
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Reset Password
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
          Create a strong new password for your account. Make sure it’s
          something secure and easy for you to remember.
        </p>
      </div>

      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={resetPasswordSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            setApiError("");
            setSuccessMessage("");

            const res = await resetPassword({
              email,
              password: values.password,
              resetToken,
            });

            setSuccessMessage(res?.message || "Password updated successfully");

            sessionStorage.removeItem("resetEmail");
            sessionStorage.removeItem("resetToken");

            resetForm();

            setTimeout(() => {
              router.push("/login");
            }, 1200);
          } catch (err) {
            const message =
              err?.response?.data?.message ||
              err?.message ||
              err?.error ||
              err?.errors?.[0]?.message ||
              "Failed to update password";

            setApiError(message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Block */}
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                <Mail className="h-4 w-4 text-cyan-300" />
                Verified Email Address
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white opacity-80 outline-none"
                />

                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-white/15"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Change
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3">
                <p className="text-xs leading-5 text-slate-400">
                  This email has already passed OTP verification for password
                  reset. If you want to use another email, restart the recovery
                  flow.
                </p>
              </div>
            </div>

            {/* Password Section */}
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
                <LockKeyhole className="h-4 w-4 text-cyan-300" />
                Create New Password
              </div>

              <div className="space-y-5">
                <PasswordInput
                  label="New Password"
                  name="password"
                  value={values.password}
                  onChange={(e) => {
                    setApiError("");
                    setSuccessMessage("");
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter new password"
                  error={errors.password}
                  touched={touched.password}
                  autoComplete="new-password"
                />

                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={(e) => {
                    setApiError("");
                    setSuccessMessage("");
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Confirm new password"
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Messages */}
            {apiError && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {successMessage}
              </div>
            )}

            {/* Security Note */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs leading-5 text-slate-400">
                Use a password that is at least 8 characters long and avoid
                reusing passwords from other accounts.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>
        )}
      </Formik>

      <p className="mt-6 text-center text-sm text-slate-300">
        Back to{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
