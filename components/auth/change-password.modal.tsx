"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { sendRequest } from "@/app/utils/api";
import { Eye, EyeOff } from "lucide-react";

const step1Schema = z.object({
  email: z.email("Invalid email address"),
});

const step2Schema = step1Schema
  .extend({
    otp: z
      .string()
      .min(1, "OTP is required")
      .min(6, "OTP must be 6 characters")
      .regex(/^[0-9]+$/, "OTP has invalid characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required")
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
});
type FormSchema = z.infer<typeof formSchema>;

const ChangePasswordModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const steps = [
    {
      title: "Step 1",
      description: "",
      fields: ["email"],
    },
    {
      title: "Step 2",
      description: "",
      fields: ["otp", "password", "confirmPassword"],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentForm = steps[currentStep];

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const schemas = [step1Schema, step2Schema];
  const form = useForm({
    resolver: zodResolver(schemas[currentStep]),
    mode: "onSubmit",
  });

  const handleResendButton = async () => {
    const isStepValid = await form.trigger(["email"]);

    if (!isStepValid) {
      return;
    }

    const email = form.getValues("email");
    const res = await sendRequest<IBackendResponse<{ id: number }>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
      body: { email },
    });
    if (res?.data) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Failed to resend OTP", {
        description: res?.message || "An error occurred",
      });
    }
  };

  const onSubmit = async (data: FormSchema) => {
    const { otp, email, password, confirmPassword } = data;
    console.log("Console Logging ~~ ~ onSubmit ~ data:", data);

    const res = await sendRequest<IBackendResponse<ILogin>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
      body: { otp, email, password, confirmPassword },
    });
    console.log("Console Logging ~~ ~ onSubmit ~ res:", res);

    if (res?.data) {
      toast.success("Password changed successfully", {
        description: "Your password has been changed, please login to continue",
        position: "top-right",
      });
      onOpenChange(false);
    } else {
      toast.error("Failed to change password", {
        description: res?.message || "An error occurred",
        position: "top-right",
      });
    }
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0: {
        return (
          <FieldGroup>
            <FieldDescription>
              To change your password, please enter your email
            </FieldDescription>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="email"
                    placeholder="username@example.com"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        );
      }

      case 1: {
        return (
          <FieldGroup>
            <FieldSet>
              <FieldDescription>Change Password</FieldDescription>
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-form-password">
                        Password*
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="register-form-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
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

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-form-confirmPassword">
                        Confirm Password*
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="register-form-confirmPassword"
                          aria-invalid={fieldState.invalid}
                          placeholder="Confirm your password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword
                              ? "Hide password"
                              : "Show password"}
                          </span>
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="otp">Enter the OTP code</FieldLabel>
                      <InputOTP
                        id="otp"
                        maxLength={6}
                        pattern="^[a-zA-Z0-9]+$"
                        value={field.value}
                        onChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                        onBlur={field.onBlur}
                        disabled={false}
                      >
                        <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                          {Array.from({ length: 6 }, (_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                      <FieldDescription></FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        );
      }

      default: {
        return null;
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        setCurrentStep(0);
        form.reset();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{currentForm.title}</DialogTitle>
          <p className="text-muted-foreground text-xs">
            Step {currentStep + 1} of {steps.length}
          </p>
          <DialogDescription>{currentForm.description}</DialogDescription>
          <Progress value={progress} />
        </DialogHeader>
        <form
          id="multi-form"
          onSubmit={form.handleSubmit(onSubmit as SubmitHandler<any>)}
        >
          {renderCurrentStepContent()}
        </form>
        <DialogFooter className="flex justify-between">
          <Field className="justify-between" orientation="horizontal">
            {!isLastStep && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleResendButton}
                className="cursor-pointer"
              >
                Resend
              </Button>
            )}
            {isLastStep && (
              <Button
                type="submit"
                form="multi-form"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting ? <Spinner /> : "Submit"}
              </Button>
            )}
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
