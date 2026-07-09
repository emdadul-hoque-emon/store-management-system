import { EyeOff, Lock, ScanEye, Store, User } from "lucide-react";
import Link from "next/link";
import React from "react";

import LoginForm from "@/components/modules/auth/LoginForm";

const page = () => {
  return (
    <div className="h-screen bg-primary-container industrial-grid flex items-center justify-center p-gutter">
      <main className="w-full max-w-110 flex flex-col gap-8 items-center">
        {/* <!-- Brand Identity --> */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-secondary-container flex items-center justify-center rounded-lg shadow-lg border-2 border-primary-container">
            <span
              className="material-symbols-outlined text-primary-container text-4xl"
              data-icon="factory"
            >
              <Store />
            </span>
          </div>
          <div className="text-center">
            <h1 className="font-extrabold text-xl text-primary-foreground tracking-tight">
              LOGISTICS &amp; INVENTORY
            </h1>
          </div>
        </div>
        {/* <!-- Login Card --> */}
        <div className="w-full bg-background rounded-lg  p-10 relative overflow-hidden">
          <div className="mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Welcome Back
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Enter your credentials to access the dashboard.
            </p>
          </div>
          <LoginForm />
        </div>
        {/* <!-- System Footer --> */}
        <footer className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <Link
              className="font-label-md text-label-md text-on-primary-container"
              href="#"
            >
              support
            </Link>
            <Link
              className="font-label-md text-label-md text-on-primary-container"
              href="#"
            >
              privacy policy
            </Link>
            <Link
              className="font-label-md text-label-md text-on-primary-container s"
              href="#"
            >
              about us
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default page;
