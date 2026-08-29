import { Link } from "react-router-dom";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function Login() {
  const { form, onSubmit, isSubmitting } = useLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to College Marketplace"
      subtitle="Enter your college credentials to continue."
      footer={
        <p className="text-center text-sm text-ink-soft">
          New to College Marketplace?{" "}
          <Link
            to="/signup"
            className="font-semibold text-white hover:underline underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        <TextField
          label="College email"
          type="email"
          placeholder="Enter your college provided email"
          icon={<HiOutlineEnvelope className="h-4.5 w-4.5" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-1.5">
          <PasswordField
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-white hover:text-shadow-white underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
