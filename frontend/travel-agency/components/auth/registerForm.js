"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Mail,
  UploadCloud,
  X,
} from "lucide-react";

import AuthLayout from "./authLayout";
import PasswordInput from "../global/passwordInput";
import OtpInput from "./otpInput";
import {
  registerUser,
  sendRegisterEmailOtp,
  verifyRegisterEmailOtp,
} from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { getErrorMessage } from "@/utils/errorHandler";
import { showToast } from "@/store/slices/toast.slice";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function RegisterForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const dispatch = useAppDispatch();

  const [apiError, setApiError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSendLoading, setOtpSendLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const [otpToken, setOtpToken] = useState("");
  const [verifiedEmailToken, setVerifiedEmailToken] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const validateImageFile = (file) => {
    if (!file) return "";

    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, and WEBP images are allowed";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Image size must be less than 2MB";
    }

    return "";
  };

  const registerSchema = Yup.object({
    name: Yup.string()
      .min(4, "Name must be at least 4 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
      .required("Contact number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    image: Yup.mixed().nullable(),
  });

  const updateSelectedImage = (file, setFieldValue) => {
    const validationMessage = validateImageFile(file);

    if (validationMessage) {
      setImageError(validationMessage);
      setFieldValue("image", null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }
      return;
    }

    setImageError("");
    setFieldValue("image", file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("");
    }
  };

  const resetOtpState = () => {
    setOtp("");
    setOtpMessage("");
    setOtpError("");
    setOtpSent(false);
    setOtpVerified(false);
    setOtpSendLoading(false);
    setOtpVerifyLoading(false);
    setSecondsLeft(0);
    setShakeKey((prev) => prev + 1);
    setVerifiedEmail("");
    setOtpToken("");
    setVerifiedEmailToken("");
  };

  const handleSendOtp = async (email) => {
    try {
      setOtpSendLoading(true);
      setOtpError("");
      setOtpMessage("");
      setApiError("");

      const res = await sendRegisterEmailOtp({ email });

      setOtpToken(res?.data?.otpToken || "");
      setOtp("");
      setOtpSent(true);
      setOtpVerified(false);
      setVerifiedEmail("");
      setVerifiedEmailToken("");

      setOtpMessage("OTP sent successfully to your email.");
      dispatch(
        showToast({ type: "success", message: "OTP sent successfully" }),
      );

      setSecondsLeft(30);
      setShakeKey((prev) => prev + 1);
    } catch (err) {
      const message = getErrorMessage(err);

      setOtpError(message);
      dispatch(showToast({ type: "error", message }));
    } finally {
      setOtpSendLoading(false);
    }
  };

  const handleVerifyOtp = async (email, otpValue = otp) => {
    try {
      if (!otpValue || otpValue.length < 6 || otpVerifyLoading) return;

      setOtpVerifyLoading(true);
      setOtpError("");
      setOtpMessage("");
      setApiError("");

      const res = await verifyRegisterEmailOtp({
        email,
        otp: otpValue,
        otpToken,
      });

      setOtpVerified(true);
      setVerifiedEmail(email);
      setVerifiedEmailToken(res?.data?.verifiedEmailToken || "");
      setOtpMessage("Email verified successfully.");

      dispatch(
        showToast({ type: "success", message: "Email verified successfully" }),
      );
    } catch (err) {
      const message = getErrorMessage(err);

      setOtpVerified(false);
      setVerifiedEmail("");
      setVerifiedEmailToken("");
      setOtpError(message);
      setShakeKey((prev) => prev + 1);

      dispatch(showToast({ type: "error", message }));
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/15 text-3xl ring-1 ring-cyan-300/20">
          🌍
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-200 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          Start Your Travel Journey
        </div>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Create Account
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
          Join now to manage trips, bookings, and your personalized travel
          profile with ease.
        </p>
      </div>

      <Formik
        initialValues={{
          name: "",
          email: "",
          contact: "",
          password: "",
          confirmPassword: "",
          image: null,
        }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            setApiError("");
            setImageError("");

            if (!otpVerified || verifiedEmail !== values.email.trim()) {
              setApiError("Please verify your email before creating account.");
              return;
            }

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("contact", values.contact);
            formData.append("password", values.password);
            formData.append("verifiedEmailToken", verifiedEmailToken);

            if (values.image) {
              formData.append("image", values.image);
            }

            await registerUser(formData);

            resetForm();
            resetOtpState();

            if (imagePreview) {
              URL.revokeObjectURL(imagePreview);
            }
            setImagePreview("");

            router.push("/login");
          } catch (err) {
            const message = getErrorMessage(err);
            setApiError(message);
            dispatch(showToast({ type: "error", message }));
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
          setFieldTouched,
        }) => {
          const trimmedEmail = values.email.trim();
          const emailLooksValid =
            !!trimmedEmail &&
            !errors.email &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

          const isCurrentEmailVerified =
            otpVerified && verifiedEmail === trimmedEmail;

          return (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Profile Photo
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Optional. Add a profile image for a more personalized
                      account.
                    </p>
                  </div>

                  {values.image && (
                    <button
                      type="button"
                      onClick={() => {
                        setFieldValue("image", null);
                        setImageError("");

                        if (imagePreview) {
                          URL.revokeObjectURL(imagePreview);
                        }
                        setImagePreview("");
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <div className="relative">
                    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 ring-4 ring-white/5">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <ImagePlus className="h-8 w-8" />
                          <span className="mt-1 text-[11px]">No image</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg transition hover:bg-cyan-300"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);

                        const file = e.dataTransfer.files?.[0] || null;
                        updateSelectedImage(file, setFieldValue);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer rounded-3xl border border-dashed p-5 text-center transition ${
                        isDragging
                          ? "border-cyan-300 bg-cyan-400/10"
                          : "border-white/15 bg-white/5 hover:border-cyan-300/50 hover:bg-white/10"
                      }`}
                    >
                      <UploadCloud className="mx-auto h-8 w-8 text-cyan-300" />
                      <p className="mt-3 text-sm font-medium text-white">
                        Drag & drop your image here
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        or click to browse files
                      </p>
                      <p className="mt-3 text-[11px] text-slate-500">
                        JPG, PNG, WEBP • Max 2MB
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0] || null;
                        updateSelectedImage(file, setFieldValue);
                      }}
                    />

                    {imageError && (
                      <p className="mt-3 text-sm text-red-300">{imageError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={(e) => {
                    setApiError("");
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:ring-2 ${
                    errors.name && touched.name
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/10 focus:ring-cyan-400"
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="mt-2 text-sm text-red-300">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email Address
                </label>

                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <input
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => {
                          const nextEmail = e.target.value;

                          setApiError("");
                          handleChange(e);

                          if (
                            verifiedEmail &&
                            nextEmail.trim() !== verifiedEmail
                          ) {
                            resetOtpState();
                          }
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFieldTouched("email", true, true);
                        }}
                        placeholder="Enter your email"
                        className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:ring-2 ${
                          errors.email && touched.email
                            ? "border-red-400 focus:ring-red-400"
                            : isCurrentEmailVerified
                              ? "border-green-400/70 focus:ring-green-400"
                              : "border-white/10 focus:ring-cyan-400"
                        }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSendOtp(trimmedEmail)}
                      disabled={
                        otpSendLoading ||
                        !emailLooksValid ||
                        isCurrentEmailVerified ||
                        secondsLeft > 0
                      }
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isCurrentEmailVerified
                          ? "border border-green-400/30 bg-green-500/10 text-green-300"
                          : "bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                      }`}
                    >
                      {isCurrentEmailVerified ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </>
                      ) : otpSendLoading ? (
                        "Sending OTP..."
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          {otpSent ? "Resend OTP" : "Verify Email"}
                        </>
                      )}
                    </button>
                  </div>

                  {errors.email && touched.email && (
                    <p className="text-sm text-red-300">{errors.email}</p>
                  )}

                  {otpSent && !isCurrentEmailVerified && (
                    <div className="rounded-[28px] border border-cyan-400/15 bg-linear-to-br from-cyan-400/10 via-slate-900/70 to-slate-900 p-4 sm:p-5">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Enter Email OTP
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            We sent a 6-digit OTP to{" "}
                            <span className="font-medium text-cyan-300">
                              {trimmedEmail}
                            </span>
                          </p>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-slate-950/30 p-3 sm:p-4">
                          <OtpInput
                            key={shakeKey}
                            value={otp}
                            onChange={(value) => {
                              setOtp(value);
                              setOtpError("");
                              setOtpMessage("");
                              setApiError("");
                            }}
                            onComplete={(value) => {
                              handleVerifyOtp(trimmedEmail, value);
                            }}
                            length={6}
                            disabled={otpVerifyLoading}
                            hasError={!!otpError}
                            isSuccess={isCurrentEmailVerified}
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-1">
                          <button
                            type="button"
                            onClick={() => handleSendOtp(trimmedEmail)}
                            disabled={secondsLeft > 0 || otpSendLoading}
                            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {secondsLeft > 0
                              ? `Resend in ${secondsLeft}s`
                              : "Resend OTP"}
                          </button>
                        </div>

                        {otpVerifyLoading && (
                          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                            Verifying OTP...
                          </div>
                        )}

                        {otpMessage && (
                          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                            {otpMessage}
                          </div>
                        )}

                        {otpError && (
                          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {otpError}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Contact Number
                </label>
                <input
                  name="contact"
                  type="text"
                  value={values.contact}
                  onChange={(e) => {
                    setApiError("");
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  placeholder="Enter your contact number"
                  className={`w-full rounded-2xl border bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:ring-2 ${
                    errors.contact && touched.contact
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/10 focus:ring-cyan-400"
                  }`}
                />
                {errors.contact && touched.contact && (
                  <p className="mt-2 text-sm text-red-300">{errors.contact}</p>
                )}
              </div>

              <PasswordInput
                label="Password"
                name="password"
                value={values.password}
                onChange={(e) => {
                  setApiError("");
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="Create password"
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
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="Confirm password"
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                autoComplete="new-password"
              />

              {!isCurrentEmailVerified && trimmedEmail && !errors.email && (
                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                  Please verify your email before creating your account.
                </div>
              )}

              {apiError && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !isCurrentEmailVerified}
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          );
        }}
      </Formik>

      <p className="mt-6 text-center text-sm text-slate-300">
        Already have an account?{" "}
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
