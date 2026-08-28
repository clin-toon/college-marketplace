import { AuthLayout } from "@/components/layout/AuthLayout";
import { OtpDigitInput } from "@/components/ui/OtpDigitInput";
import { Button } from "@/components/ui/Button";
import { useOtp } from "@/features/auth/hooks/useOtp";

export default function VerifyOtp() {
  const {
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
  } = useOtp();

  return (
    <AuthLayout
      eyebrow="Verify your email"
      title="Enter the code"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "We sent a 6-digit code to your email."
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <OtpDigitInput
          digits={digits}
          error={error}
          inputRefs={inputRefs}
          onChangeDigit={setDigit}
          onKeyDownDigit={handleKeyDown}
          onPasteDigits={handlePaste}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="cusor-pointer"
        >
          {isSubmitting ? "Verifying…" : "Verify email"}
        </Button>

        <p className="text-center text-sm text-ink-soft">
          Didn't get a code?{" "}
          {cooldown > 0 ? (
            <span className="font-mono text-xs text-white">
              Resend in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-white hover:underline disabled:opacity-60 cursor-pointer "
            >
              {isResending ? "Sending…" : "Resend code"}
            </button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
}
