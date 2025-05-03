"use client";

import { AuthLayout } from "@/app/layout/AuthLayout";
import { Button } from "@/app/components/ui/button";
import { useState, useTransition } from "react";
import {
  startRegistration,
} from "@simplewebauthn/browser";
import {
  finishPasskeyRegistration,
  startPasskeyRegistration,
} from "./functions";
import { Alert, AlertTitle } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";


export function Signup() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();


  const passkeyRegister = async () => {
    // 1. Get a challenge from the worker
    const options = await startPasskeyRegistration(username);

    // 2. Ask the browser to sign the challenge
    const registration = await startRegistration({ optionsJSON: options });


    // 3. Give the signed challenge to the worker to finish the registration process
    const success = await finishPasskeyRegistration(username, registration);

    if (!success) {
      setResult("Registration failed");
    }
  };

  const handlePerformPasskeyRegister = () => {
    startTransition(() => void passkeyRegister());
  };

  return (
    <AuthLayout isSignup={true}>
      <div className="auth-form max-w-[400px] w-full mx-auto px-10 bg-white rounded-lg shadow-md py-10">
        <h1 className="page-title text-center">Create your account</h1>
        <p className="pt-6">Enter a username to setup an account</p>
        <p className="pb-6">You'll only need to do this once.</p>
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
        <Button onClick={handlePerformPasskeyRegister} disabled={isPending} className="font-display w-full mb-6">
          {isPending ? <>...</> : "Register with Passkey"}
        </Button>
        <p>GridOS is owned by you. No one else.</p>
      </div>
    </AuthLayout>
  );
}