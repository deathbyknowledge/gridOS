import { defineApp } from "@redwoodjs/sdk/worker";
import { route, render, prefix } from "@redwoodjs/sdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { authMiddleware, setCommonHeaders } from "@/app/middleware";
import { userRoutes } from "@/app/pages/user/routes";
import { Session } from "./session/durableObject";
import type { User } from "@prisma/client";
export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  authMiddleware(),
  render(Document, [
    prefix("/user", userRoutes),
    ({ ctx }) => {
      if (!ctx.user) {
        return new Response(null, {
          status: 302,
          headers: { Location: "/user/auth" },
        });
      }
    },
    route("/", Home),
  ]),
]);
