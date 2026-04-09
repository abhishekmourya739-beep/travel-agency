"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, Mail, ShieldCheck, ArrowRight } from "lucide-react";

import AuthLayout from "./authLayout";
import PasswordInput from "../global/passwordInput";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/context/authContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20">
          <LogIn className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          Welcome Back
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Sign In
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
          Access your travel account to manage trips, view bookings, and
          continue your journey seamlessly.
        </p>
      </div>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setApiError("");
            setSuccessMessage("");

            const res = await loginUser(values);

            const accessToken = res?.data?.accessToken;
            const refreshToken = res?.data?.refreshToken;
            const user = res?.data?.user;

            if (!accessToken) {
              throw new Error("Token not received from server");
            }

            await login({
              token: accessToken,
              refreshToken,
              user,
            });

            setSuccessMessage(res?.message || "Login successful");

            setTimeout(() => {
              router.push("/");
              router.refresh();
            }, 900);
          } catch (err) {
            const message =
              err?.message ||
              err?.error ||
              err?.errors?.[0]?.message ||
              "Invalid credentials";

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
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                <Mail className="h-4 w-4 text-cyan-300" />
                Email Address
              </div>

              <input
                name="email"
                type="email"
                value={values.email}
                onChange={(e) => {
                  setApiError("");
                  setSuccessMessage("");
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="Enter your registered email"
                className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-4 ${
                  errors.email && touched.email
                    ? "border-red-400 focus:ring-red-400/20"
                    : "border-white/10 focus:border-cyan-300/70 focus:ring-cyan-400/15"
                }`}
              />

              {errors.email && touched.email && (
                <p className="mt-3 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                Secure Password
              </div>

              <PasswordInput
                label=""
                name="password"
                value={values.password}
                onChange={(e) => {
                  setApiError("");
                  setSuccessMessage("");
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="Enter your password"
                error={errors.password}
                touched={touched.password}
                autoComplete="current-password"
                rightLabel={
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Forgot password?
                  </Link>
                }
              />
            </div>

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

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs leading-5 text-slate-400">
                Your account is protected with secure authentication. Keep your
                login details private and avoid using shared devices for
                sensitive access.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>
        )}
      </Formik>

      <p className="mt-6 text-center text-sm text-slate-300">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}
