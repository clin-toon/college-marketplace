import { Link } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineUser } from "react-icons/hi2";
import { FaPhoneAlt } from "react-icons/fa";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { FACULTIES, SEMESTERS } from "@/lib/constants";

export default function Signup() {
  const { form, onSubmit, isSubmitting } = useSignup();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join your campus quad"
      subtitle="Sign up with your college email to start buying and selling."
      footer={
        <p className="text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <TextField
          label="Full name"
          placeholder="Aayush Shrestha"
          icon={<HiOutlineUser className="h-4.5 w-4.5" />}
          error={errors.fullName?.message}
          maxLength={50}
          {...register("fullName")}
        />

        <TextField
          label="College email"
          type="email"
          placeholder="yourname@oic.edu.np"
          icon={<HiOutlineEnvelope className="h-4.5 w-4.5" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Phone NUmber"
          type="string"
          maxLength={10}
          placeholder="Enter your phone number"
          icon={<FaPhoneAlt className="h-4.5 w-4.5" />}
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Faculty"
            placeholder="Choose faculty"
            error={errors.faculty?.message}
            {...register("faculty")}
          >
            {FACULTIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.value}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Semester"
            placeholder="Choose semester"
            error={errors.semester?.message}
            {...register("semester")}
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </SelectField>
        </div>

        <PasswordField
          label="Password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="mt-2 text-white cursor-pointer "
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
