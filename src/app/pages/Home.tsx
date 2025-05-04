import { RequestInfo } from "@redwoodjs/sdk/worker";
import ShellLayout from "../layout/ShellLayout";

export function Home({ ctx }: RequestInfo) {
  return (
    <ShellLayout user={ctx.user!}>
      <p>
        {ctx.user?.username
          ? `You are logged in as user ${ctx.user.username}`
          : "You are not logged in"}
      </p>
    </ShellLayout>
  );
}
