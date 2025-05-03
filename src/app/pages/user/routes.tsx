import { route } from "@redwoodjs/sdk/router";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { sessions } from "@/session/store";
import { db } from "@/db";

export const userRoutes = [
  route("/auth", async ({ ctx, headers }) => {
    if (ctx.user) {
      headers.set("Location", "/user/login");
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    const registered = await db.user.count();
    if (registered == 0) {
      return <Signup />
    } else {
      return <Login />
    }

  }),
  route("/logout", async function ({ request }) {
    const headers = new Headers();
    await sessions.remove(request, headers);
    headers.set("Location", "/user/login");

    return new Response(null, {
      status: 302,
      headers,
    });
  }),
];
