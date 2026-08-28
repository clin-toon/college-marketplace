import type { KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/cn";

interface OtpDigitInputProps {
  digits: string[];
  error?: string | null;
  inputRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  onChangeDigit: (index: number, value: string) => void;
  onKeyDownDigit: (index: number, key: string) => void;
  onPasteDigits: (value: string) => void;
}

export function OtpDigitInput({
  digits,
  error,
  inputRefs,
  onChangeDigit,
  onKeyDownDigit,
  onPasteDigits,
}: OtpDigitInputProps) {
  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    onKeyDownDigit(index, e.key);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    onPasteDigits(e.clipboardData.getData("text"));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => onChangeDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            className={cn(
              "h-14 w-12 rounded-xl border bg-white text-center font-mono text-xl font-semibold text-ink",
              "transition-all duration-150 outline-none",
              "focus:border-quad focus:ring-4 focus:ring-quad/10",
              error ? "border-danger" : "border-paper-dim"
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
