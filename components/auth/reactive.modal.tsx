"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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

const formSchema = z.object({
  email: z.string(),
  otp: z
    .string()
    .min(1, "OTP is required")
    .min(6, "OTP must be 6 characters")
    .regex(/^[0-9]+$/, "OTP has invalid characters"),
});

type FormSchema = z.infer<typeof formSchema>;

const ReactiveModal = ({
  open,
  onOpenChange,
  userEmail,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
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
      fields: ["otp"],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [userId, setUserId] = useState(0);

  const currentForm = steps[currentStep];

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      otp: "",
    },
    mode: "onSubmit",
  });

  const handleResendButton = async () => {
    const res = await sendRequest<IBackendResponse<{ id: number }>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`,
      body: { email: userEmail },
    });

    if (res?.data) {
      setCurrentStep((prev) => prev + 1);
      setUserId(res.data.id);
    } else {
      toast.error("Failed to resend OTP", {
        description: res?.message || "An error occurred",
      });
    }
  };

  const handleBackButton = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: { otp: string }) => {
    const { otp } = data;
    console.log("Console Logging ~~ ~ onSubmit ~ otp:", otp);

    const res = await sendRequest<IBackendResponse<ILogin>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
      body: { id: userId, otp },
    });

    if (res?.data) {
      toast.success("Verification successful", {
        description: "Your account has been verified, please login to continue",
        position: "top-right",
      });
      onOpenChange(false);
    } else {
      toast.error("Failed to verify OTP", {
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
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldDescription>
                    Your account is not verified. Please check your email for
                    verification code.
                  </FieldDescription>
                  <Input
                    {...field}
                    id="email"
                    disabled
                    placeholder={userEmail}
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
        );
      }

      default: {
        return null;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentForm.title}</DialogTitle>
          <p className="text-muted-foreground text-xs">
            Step {currentStep + 1} of {steps.length}
          </p>
          <DialogDescription>{currentForm.description}</DialogDescription>
          <Progress value={progress} />
        </DialogHeader>
        <form id="multi-form" onSubmit={form.handleSubmit(onSubmit)}>
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

export default ReactiveModal;
