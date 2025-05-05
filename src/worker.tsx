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
import { Contacts } from "./app/pages/contacts/Contacts";
import { Test } from "./app/pages/test/Test";
import { env } from "cloudflare:workers";
import { db } from "./db";
import { Chat } from "./app/pages/iso/Chat";


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
      const path = decodeURIComponent(params.$0);
      switch (request.method) {
        case "GET": {
          const file = await db.files.findUnique({ where: { path: path } });
          if (!file) {
            return new Response("File Not Found For " + path, { status: 404 });
          }
          const object = await env.R2.get(toR2Key(file.blobKey));
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
        case "PUT": {
          const file = await db.files.findUnique({
            where: {
              path
            }
          });
          const formData = await request.formData();
          const fileData = formData.get("file") as File;
          const id = file ? file.blobKey : crypto.randomUUID();
          // Stream the file directly to R2
          await env.R2.put(toR2Key(id), fileData.stream(), {
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
        case "DELETE": {
          const file = await db.files.findUnique({
            where: {
              path
            }
          });
          if (!file) {
            return new Response("File Not Found", { status: 404 });
          }
          await env.R2.delete(toR2Key(file.blobKey));
          await db.files.delete({
            where: {
              path
            }
          });
          return new Response(null, { status: 204 });
        }
        default: {
          return new Response("Method Not Allowed", { status: 405 });
        }
      }
    }),
  ]),
]);

const toR2Key = (key: string) => {
  return `blobs/${key}`
}

export { SessionDurableObject } from "./session/durableObject";