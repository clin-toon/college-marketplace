import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { otpSchema } from "@/features/auth/schemas/authSchemas";
import {
  resendOtpRequest,
  verifyOtpRequest,
} from "@/features/auth/api/authApi";
import { OTP_LENGTH, OTP_RESEND_SECONDS } from "@/lib/constants";

interface LocationState {
  email?: string;
}

export function useOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState | null)?.email ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(OTP_RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Redirect back to signup if someone lands here without an email context.
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    next[index] = clean[clean.length - 1];
    setDigits(next);
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(pasted: string) {
    const clean = pasted.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (clean.length === 0) return;
    const next = Array(OTP_LENGTH).fill("");
    clean.forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputRefs.current[Math.min(clean.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleSubmit() {
    const otp = digits.join("");
    const parsed = otpSchema.safeParse({ otp });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter the full code");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await verifyOtpRequest({ email, otp });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      const result = await resendOtpRequest(email);
      toast.success(result.message);
      setDigits(Array(OTP_LENGTH).fill(""));
      setCooldown(OTP_RESEND_SECONDS);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Couldn't resend the code. Try again shortly.");
    } finally {
      setIsResending(false);
    }
  }

  return {
    email,
    digits,
    error,
    isSubmitting,
    isResending,
    cooldown,
    inputRefs,
    setDigit,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
  };
}
