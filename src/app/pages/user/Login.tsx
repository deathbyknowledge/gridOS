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

const TURNSTILE_SITE_KEY = "0x4AAAAAABZlljuWmm2hCnKp";

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
      setResult("Login successful!");
    }
  };

  const handlePerformPasskeyLogin = () => {
    startTransition(() => void passkeyLogin());
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
        <Button onClick={handlePerformPasskeyLogin} disabled={isPending}>
          {isPending ? <>...</> : "Login with passkey"}
        </Button>
        {result && <div>{result}</div>}
      </main>
      );
}
