"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { login } from "@/services/auth/auth.service";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";

type Props = {};

const LoginForm = (props: Props) => {
  const [state, action, isPending] = useActionState(login, null);
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message || "Login failed. Please try again.");
    }
  }, [state]);

  console.log(state);
  return (
    <form action={action} className="flex flex-col gap-6" id="loginForm">
      {/* <!-- Email Field --> */}
      <Field className="flex flex-col gap-2">
        <FieldLabel
          className="font-label-md text-label-md text-on-surface-variant"
          htmlFor="email"
        >
          EMAIL
        </FieldLabel>
        <FieldContent className="relative group ">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            data-icon="person"
          >
            <User size={18} />
          </span>
          <Input
            className="w-full pl-10 pr-12 py-5 "
            id="email"
            placeholder="operator@system.io"
            type="email"
            name="email"
          />
        </FieldContent>
      </Field>
      {/* <!-- Password Field --> */}
      <Field className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <FieldLabel
            className="font-label-md text-label-md text-on-surface-variant"
            htmlFor="password"
          >
            PASSWORD
          </FieldLabel>
          <Link
            className="font-label-md text-sm opacity-70  hover:underline"
            href="#"
          >
            forgot password?
          </Link>
        </div>
        <FieldContent className="relative">
          <span
            id="pass-icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg"
            data-icon="lock"
          >
            <Lock size={18} />
          </span>
          <Input
            className="w-full pl-10 pr-12 py-5 "
            id="password"
            placeholder="••••••••••••"
            type={showPassword ? "text" : "password"}
            name="password"
          />
          <button
            // variant="ghost"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            type="button"
          >
            <span
              className="material-symbols-outlined text-lg"
              data-icon="visibility"
              id="pass-icon"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </button>
        </FieldContent>
      </Field>
      {/* <!-- Options --> */}
      <Field orientation={"horizontal"} className="flex items-cente">
        <Checkbox id="rememberMe" />
        <FieldLabel htmlFor="rememberMe">Remember me</FieldLabel>
      </Field>
      {/* <!-- Action Button --> */}
      <Button className="py-5" type="submit">
        <span className="font-bold">LOGIN</span>
      </Button>
      <div className="flex w-full justify-center items-center gap-0.5">
        <p>Are you a store owner?</p>
        <Link className="underline text-blue-500" href="/register-store">
          Create Store
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
