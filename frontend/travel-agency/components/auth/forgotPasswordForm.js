"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ShieldCheck,
  RefreshCcw,
  ArrowRight,
  KeyRound,
} from "lucide-react";

import AuthLayout from "./authLayout";
import { forgotPassword, verifyForgotPasswordOtp } from "@/lib/api/auth";
import OtpInput from "./otpInput";
import useOtpFlow from "@/hooks/useOtpFlow";

const RESEND_SECONDS = 30;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [pageError, setPageError] = useState("");
  const [step, setStep] = useState("email");
  const [sentEmail, setSentEmail] = useState("");

  const forgotPasswordSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const otpFlow = useOtpFlow({
    length: 6,
    resendSeconds: RESEND_SECONDS,
    sendOtpApi: async (payload) => {
      return await forgotPassword(payload);
    },
    verifyOtpApi: async (otp) => {
      return await verifyForgotPasswordOtp({
        email: sentEmail,
        otp,
      });
    },
    onVerified: async (res) => {
      const resetToken = res?.data?.resetToken;

      if (!resetToken) {
        throw new Error("Reset token not received");
      }

      sessionStorage.setItem("resetEmail", sentEmail);
      sessionStorage.setItem("resetToken", resetToken);

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(sentEmail)}`);
      }, 900);
    },
    autoSubmit: true,
  });

  const handleChangeEmail = () => {
    setStep("email");
    setSentEmail("");
    setPageError("");
    otpFlow.resetOtpState();
  };

  const handleResendOtp = async () => {
    try {
      setPageError("");
      await otpFlow.sendOtp({ email: sentEmail });
    } catch {}
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
          <KeyRound className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          Recover Your Account
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Forgot Password
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
          Enter your registered email and we’ll send a secure one-time password
          to verify your identity.
        </p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setPageError("");
            otpFlow.clearMessages();

            const res = await otpFlow.sendOtp({ email: values.email });

            setSentEmail(values.email);
            setStep("otp");
          } catch (err) {
            const message =
              err?.response?.data?.message ||
              err?.message ||
              err?.error ||
              err?.errors?.[0]?.message ||
              "Failed to send OTP";

            setPageError(message);
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                <Mail className="h-4 w-4 text-cyan-300" />
                Email Address
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    name="email"
                    type="email"
                    value={step === "otp" ? sentEmail : values.email}
                    onChange={(e) => {
                      setPageError("");
                      otpFlow.clearMessages();

                      if (step === "email") {
                        handleChange(e);
                      }
                    }}
                    onBlur={handleBlur}
                    disabled={step === "otp"}
                    placeholder="Enter your registered email"
                    className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                      errors.email && touched.email
                        ? "border-red-400 focus:ring-red-400/20"
                        : "border-white/10 focus:border-cyan-300/70 focus:ring-cyan-400/15"
                    }`}
                  />
                </div>

                {step === "otp" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChangeEmail();
                      setFieldValue("email", sentEmail);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-white/15"
                  >
                    Change
                  </button>
                )}
              </div>

              {errors.email && touched.email && step === "email" && (
                <p className="mt-3 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {pageError && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {pageError}
              </div>
            )}

            {otpFlow.message && step === "email" && (
              <div className="rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {otpFlow.message}
              </div>
            )}

            {step === "email" && (
              <button
                type="submit"
                disabled={isSubmitting || otpFlow.sendLoading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting || otpFlow.sendLoading
                  ? "Sending OTP..."
                  : "Send OTP"}
                {!isSubmitting && !otpFlow.sendLoading && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </button>
            )}

            {step === "otp" && (
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="border-b border-white/10 bg-white/5 px-5 py-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Verify OTP
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        Enter the 6-digit code sent to{" "}
                        <span className="font-medium text-cyan-300">
                          {sentEmail}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 px-5 py-6 sm:px-6">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-4 sm:p-5">
                    <OtpInput
                      key={otpFlow.shakeKey}
                      value={otpFlow.otp}
                      onChange={otpFlow.handleOtpChange}
                      length={6}
                      disabled={otpFlow.verifyLoading}
                      hasError={!!otpFlow.error}
                      isSuccess={otpFlow.isSuccess}
                    />
                  </div>

                  {(otpFlow.error || otpFlow.message) && (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        otpFlow.error
                          ? "border border-red-400/30 bg-red-500/10 text-red-200"
                          : "border border-green-400/30 bg-green-500/10 text-green-200"
                      }`}
                    >
                      {otpFlow.error || otpFlow.message}
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs leading-5 text-slate-400">
                      For security, the OTP is valid for a limited time. You can
                      request a new code once the resend timer completes.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => otpFlow.verifyOtp()}
                      disabled={
                        otpFlow.verifyLoading || otpFlow.otp.length !== 6
                      }
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {otpFlow.verifyLoading
                        ? "Verifying OTP..."
                        : "Verify OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpFlow.secondsLeft > 0 || otpFlow.sendLoading}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      {otpFlow.secondsLeft > 0
                        ? `Resend in ${otpFlow.secondsLeft}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </Formik>

      <p className="mt-6 text-center text-sm text-slate-300">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
