import { RouteMiddleware } from "@redwoodjs/sdk/router";
import { IS_DEV } from "@redwoodjs/sdk/constants";
import { db, setupDb } from "@/db";
import { sessions, setupSessionStore } from "@/session/store";
import { env } from "cloudflare:workers";
import { ErrorResponse } from "@redwoodjs/sdk/worker";

export const setCommonHeaders =
    (): RouteMiddleware =>
        ({ headers, rw: { nonce } }) => {
            if (!IS_DEV) {
                // Forces browsers to always use HTTPS for a specified time period (2 years)
                headers.set(
                    "Strict-Transport-Security",
                    "max-age=63072000; includeSubDomains; preload",
                );
            }

            // Forces browser to use the declared content-type instead of trying to guess/sniff it
            headers.set("X-Content-Type-Options", "nosniff");

            // Stops browsers from sending the referring webpage URL in HTTP headers
            headers.set("Referrer-Policy", "no-referrer");

            // Explicitly disables access to specific browser features/APIs
            headers.set(
                "Permissions-Policy",
                "geolocation=(), microphone=(), camera=()",
            );

                // Defines trusted sources for content loading and script execution:
                headers.set(
                    "Content-Security-Policy",
                    `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://github.com https://avatars.githubusercontent.com; font-src 'self' https://fonts.gstatic.com; frame-src https://challenges.cloudflare.com; object-src 'none';`,
                );

        };

export const authMiddleware = (): RouteMiddleware => async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
        ctx.session = await sessions.load(request);
    } catch (error) {
        if (error instanceof ErrorResponse && error.code === 401) {
            await sessions.remove(request, headers);
            headers.set("Location", "/user/auth");

            return new Response(null, {
                status: 302,
                headers,
            });
        }

        throw error;
    }

    // If user is logged in, add it to the ctx and continue
    if (ctx.session?.userId) {
        ctx.user = await db.user.findUnique({
            where: {
                id: ctx.session.userId,
            },
        });
    }
}