"use client";

import { FormInput } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { loginSchema, LoginSchema } from "@/lib/apis/auth/auth-schema";
import { useRouter } from "@bprogress/next";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function AuthAdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginSchema) => {
    setLoading(true);
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Login Gagal",
        description: "Terjadi kesalahan saat login. Pastikan username dan password benar.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Login Berhasil",
      description: "Anda berhasil masuk ke Laundrin.",
      variant: "success",
    });
    router.push("/");
    setLoading(false);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Laundrin</CardTitle>
        <CardDescription>Masukkan username dan password untuk akses Laundrin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} ref={formRef} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormInput label="Username" placeholder="Masukkan username" isRequired {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  type="password"
                  label="Password"
                  placeholder="Masukkan password"
                  isRequired
                  {...field}
                />
              )}
            />
          </form>
        </Form>
        <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 p-3 text-sm">
          <p className="font-medium">Akun demo</p>
          <p className="mt-1 text-muted-foreground">
            Username: <span className="font-mono">operator1</span> · Password:{" "}
            <span className="font-mono">operator1</span>
          </p>
          <Button
            type="button"
            variant="link"
            className="mt-1 h-auto p-0 text-sm"
            onClick={() => {
              form.setValue("username", "operator1");
              form.setValue("password", "operator1");
            }}
          >
            Gunakan akun demo
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() =>
            formRef.current?.dispatchEvent?.(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
          }
          type="button"
          isLoading={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AuthAdminPage;
