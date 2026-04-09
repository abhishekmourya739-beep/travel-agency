"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useOtpFlow({
  length = 6,
  resendSeconds = 60,
  sendOtpApi,
  verifyOtpApi,
  onVerified,
  autoSubmit = true,
}) {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(0);

  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const autoSubmitTimeoutRef = useRef(null);

  const clearMessages = useCallback(() => {
    setMessage("");
    setError("");
  }, []);

  const resetOtpState = useCallback(() => {
    setOtp("");
    setOtpSent(false);
    setSendLoading(false);
    setVerifyLoading(false);
    setMessage("");
    setError("");
    setSecondsLeft(0);
    setIsSuccess(false);
    setShakeKey(0);
  }, []);

  const triggerErrorState = useCallback((msg) => {
    setIsSuccess(false);
    setError(msg || "Invalid OTP");
    setShakeKey((prev) => prev + 1);
  }, []);

  const sendOtp = useCallback(
    async (payload) => {
      try {
        setSendLoading(true);
        setIsSuccess(false);
        setOtp("");
        setError("");
        setMessage("");

        const res = await sendOtpApi(payload);

        setOtpSent(true);
        setSecondsLeft(resendSeconds);
        setMessage(res?.message || "OTP sent successfully");
        return res;
      } catch (err) {
        setOtpSent(false);

        setError(
          err?.response?.data?.message || err?.message || "Failed to send OTP",
        );

        return null; // ✅ NO throw
      } finally {
        setSendLoading(false);
      }
    },
    [sendOtpApi, resendSeconds],
  );

  const verifyOtp = useCallback(
    async (passedOtp) => {
      const finalOtp = String(passedOtp ?? otp ?? "");

      try {
        setVerifyLoading(true);
        setError("");
        setMessage("");
        setIsSuccess(false);

        if (finalOtp.length !== length) {
          triggerErrorState(`Please enter the complete ${length}-digit OTP`);
          return null;
        }

        const res = await verifyOtpApi(finalOtp);

        setIsSuccess(true);
        setMessage(res?.message || "OTP verified successfully");

        if (onVerified) {
          await onVerified(res, finalOtp);
        }

        return res;
      } catch (err) {
        setOtp("");
        triggerErrorState(
          err?.response?.data?.message ||
            err?.message ||
            err?.error ||
            err?.errors?.[0]?.message ||
            "Invalid OTP",
        );
        return null;
      } finally {
        setVerifyLoading(false);
      }
    },
    [otp, length, verifyOtpApi, onVerified, triggerErrorState],
  );
  const handleOtpChange = useCallback(
    (value) => {
      setOtp(value);
      if (error) setError("");
      if (message) setMessage("");
      if (isSuccess) setIsSuccess(false);
    },
    [error, message, isSuccess],
  );

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

  useEffect(() => {
    if (!autoSubmit) return;

    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }

    if (otpSent && otp.length === length && !verifyLoading && !isSuccess) {
      autoSubmitTimeoutRef.current = setTimeout(() => {
        verifyOtp(otp);
      }, 180);
    }

    return () => {
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
  }, [otp, otpSent, length, verifyLoading, verifyOtp, autoSubmit, isSuccess]);

  return {
    otp,
    setOtp,
    otpSent,
    sendLoading,
    verifyLoading,
    message,
    error,
    secondsLeft,
    isSuccess,
    shakeKey,

    clearMessages,
    resetOtpState,
    sendOtp,
    verifyOtp,
    handleOtpChange,
  };
}
