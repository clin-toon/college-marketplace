import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/authSchemas";
import { signupRequest } from "@/features/auth/api/authApi";

export function useSignup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      faculty: undefined,
      semester: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const result = await signupRequest(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Something went wrong ");
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
