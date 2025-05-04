import { defineLinks } from "@redwoodjs/sdk/router";

export const link = defineLinks(["/",
    "/user/auth",
    "/user/logout",
    "/files*",
    "/iso",
    "/contacts",
]);
