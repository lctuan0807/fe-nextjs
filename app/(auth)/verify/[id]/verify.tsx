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
import { sendRequest } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.number(),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
});

const Verify = ({ id }: { id: number }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      otp: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await sendRequest<IBackendResponse<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
      body: { id, otp: data.otp },
    });

    if (res?.data) {
      toast.success("Verification successful", {
        description: "Your account has been verified",
        position: "top-right",
      });
      router.push("/auth/login");
    } else {
      toast.error("Verification failed", {
        description: res?.message || "Verification failed",
        position: "top-right",
      });
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} hidden>
                  <FieldLabel htmlFor="form-rhf-demo-id">ID*</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-id"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    value={id}
                    disabled
                  />
                </Field>
              )}
            />
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-otp">OTP*</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-otp"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your OTP"
                    autoComplete="one-time-code"
                  />
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
              form="form-rhf-demo"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-5 rounded-md transition-colors disabled:bg-gray-500 cursor-pointer"
            >
              Verify
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
      <Field className="border-t border-gray-200"></Field>
      <CardFooter>
        <Field className="text-center text-sm inline">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default Verify;
