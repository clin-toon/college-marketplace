import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineLockClosed } from "react-icons/hi2";
import { TextField } from "@/components/ui/TextField";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <TextField
        ref={ref}
        label={label}
        error={error}
        type={visible ? "text" : "password"}
        icon={<HiOutlineLockClosed className="h-4.5 w-4.5" />}
        rightSlot={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="text-ink-soft/70 hover:text-quad"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <HiOutlineEyeSlash className="h-4.5 w-4.5" />
            ) : (
              <HiOutlineEye className="h-4.5 w-4.5" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordField.displayName = "PasswordField";
