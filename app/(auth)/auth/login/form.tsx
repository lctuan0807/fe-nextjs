"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authenticate } from "@/app/utils/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ReactiveModal from "@/components/auth/reactive.modal";
import ChangePasswordModal from "@/components/auth/change-password.modal";

const formSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isReactiveModalOpen, setIsReactiveModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;

    // call authenticate action (app/utils/actions.ts)
    const res = await authenticate(email, password);

    if (res?.error) {
      if (res?.code === 2) {
        setIsReactiveModalOpen(true);
        setUserEmail(email);
        return;
      }

      toast.error("Login failed", {
        description: res.error,
        position: "top-right",
      });
    } else {
      toast.success("Login successful");
      // redirect to home
      router.push("/home");
    }
  };

  const onForgotPassword = () => {
    console.log("Forgot password clicked");
    setIsForgotPasswordModalOpen(true);
  };

  return (
    <>
      <Card className="w-full sm:max-w-md">
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-login-email">Email*</FieldLabel>
                    <Input
                      {...field}
                      id="form-login-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-login-password">
                      Password*
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="form-login-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <FieldGroup>
            <Field orientation="horizontal" className="py-4">
              <Button
                type="submit"
                form="form-login"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-5 rounded-md transition-colors disabled:bg-gray-500 cursor-pointer"
              >
                Sign In
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
        <Field className="border-t border-gray-200"></Field>
        <CardFooter className="flex flex-col">
          <Field className="text-center text-sm inline">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </Field>
          <Field className="text-center text-sm inline">
            <Button
              onClick={onForgotPassword}
              variant="link"
              className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Forgot your password?{" "}
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <ReactiveModal
        open={isReactiveModalOpen}
        onOpenChange={() => setIsReactiveModalOpen(false)}
        userEmail={userEmail}
      />
      <ChangePasswordModal
        open={isForgotPasswordModalOpen}
        onOpenChange={() => setIsForgotPasswordModalOpen(false)}
      />
    </>
  );
};

export default LoginForm;
