import { defineApp } from "@redwoodjs/sdk/worker";
import { route, render, prefix } from "@redwoodjs/sdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { authMiddleware, setCommonHeaders } from "@/app/middleware";
import { userRoutes } from "@/app/pages/user/routes";
import { Session } from "./session/durableObject";
import type { User } from "@prisma/client";
import Dashboard from "./app/dashboard/page";
import { Files } from "./app/pages/files/Files";
import { Chat } from "./app/pages/iso/Chat";
import { Contacts } from "./app/pages/contacts/Contacts";
import { Test } from "./app/pages/test/Test";
import { env } from "cloudflare:workers";
import { db } from "./db";


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
    route("/dashboard", Dashboard),
    route("/files*", Files),
    route("/iso", Chat),
    route("/contacts", Contacts),
    route("/test", () => <Test />),
    route("/api/file*", async ({ params, request }) => {
      const path = params.$0;
      switch (request.method) {
        case "GET": {
          const file = await db.files.findUnique({ where: { path: path } });
          if (!file) {
            return new Response("File Not Found For " + path, { status: 404 });
          }
          const object = await env.R2.get("blobs/" + file.blobKey);
          if (object === null) {
            return new Response("Object Not Found", { status: 404 });
          }
          return new Response(object.body, {
            headers: {
              "Content-Type": object.httpMetadata?.contentType as string,
              "Content-Disposition": `attachment; filename="${file.path.split("/").pop()}"`,
            },
          })
        };
        case "POST": {
          const file = await db.files.findUnique({
            where: {
              path
            }
          });
          const formData = await request.formData();
          const fileData = formData.get("file") as File;
          const id = file ? file.blobKey : crypto.randomUUID();
          // Stream the file directly to R2
          const r2ObjectKey = `blobs/${id}`;
          await env.R2.put(r2ObjectKey, fileData.stream(), {
            httpMetadata: {
              contentType: fileData.type,
            },
          });
          if (!file) {
            await db.files.create({
              data: {
                path,
                blobKey: id,
                size: fileData.size,
              },
            });
          }
          return new Response(null, {
            status: file ? 204 : 201,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        default: {
          return new Response("Method Not Allowed", { status: 405 });
        }
      }
    }),
  ]),
]);

export { SessionDurableObject } from "./session/durableObject";