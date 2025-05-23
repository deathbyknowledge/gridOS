"use client";

import { Button } from "@/app/components/ui/button";
import { useState, useTransition } from "react";
import {
  startAuthentication,
} from "@simplewebauthn/browser";
import {
  finishPasskeyLogin,
  startPasskeyLogin,
} from "./functions";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { Alert, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { link } from "@/app/shared/links";


export function Login() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const passkeyLogin = async () => {
    // 1. Get a challenge from the worker
    const options = await startPasskeyLogin();

    // 2. Ask the browser to sign the challenge
    const login = await startAuthentication({ optionsJSON: options });

    // 3. Give the signed challenge to the worker to finish the login process
    const success = await finishPasskeyLogin(login);

    if (!success) {
      setResult("Login failed");
    } else {
      window.location.href = link('/');
    }
  };

  const handlePerformPasskeyLogin = () => {
    startTransition(() => void passkeyLogin());
  };

  return (
    <AuthLayout>
      <div className="auth-form max-w-[400px] w-full mx-auto px-10">
        <h1 className="page-title text-center">Login</h1>
        <p className="py-6">Enter your username below to sign-in.</p>
        {result && (
          <Alert variant="destructive" className="mb-5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{result}</AlertTitle>
          </Alert>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Button onClick={handlePerformPasskeyLogin} disabled={isPending} className="font-display w-full mb-6">
          {isPending ? <>...</> : "Login with passkey"}
        </Button>
        <p>GridOS is owned by you. No one else.</p>
      </div>
    </AuthLayout>
  );
}
