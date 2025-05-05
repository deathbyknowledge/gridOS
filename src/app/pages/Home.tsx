import { RequestInfo } from "@redwoodjs/sdk/worker";
import ShellLayout from "../layout/ShellLayout";

export function Home({ ctx }: RequestInfo) {
  return (
    <ShellLayout user={ctx.user!}>
      <div className="h-full w-full bg-[url('/images/landscape-mj.png')] bg-cover bg-center"/>
    </ShellLayout>
  );
}
