"use client";

import { Button } from "@/app/components/ui/button";
import { useState, useTransition } from "react";
import {
  startRegistration,
} from "@simplewebauthn/browser";
import {
  finishPasskeyRegistration,
  startPasskeyRegistration,
} from "./functions";

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
    } else {
      setResult("Registration successful!");
    }
  };

  const handlePerformPasskeyRegister = () => {
    startTransition(() => void passkeyRegister());
  };

  return (
      <main className="bg-bg">
        <h1 className="text-4xl font-bold text-red-500">YOLO</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <Button onClick={handlePerformPasskeyRegister} disabled={isPending}>
          {isPending ? <>...</> : "Register with passkey"}
        </Button>
        {result && <div>{result}</div>}
      </main>
      );
}
