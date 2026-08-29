import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/authSchemas";
import { loginRequest } from "@/features/auth/api/authApi";

export function useLogin() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const result = await loginRequest(values);
      console.log(result);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);

      setTimeout(() => {
        window.location.replace("/home");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong ");
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
