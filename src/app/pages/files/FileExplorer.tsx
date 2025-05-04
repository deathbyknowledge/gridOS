import ShellLayout from "@/app/layout/ShellLayout";
import { RequestInfo } from "@redwoodjs/sdk/worker";


export function FileExplorer({ ctx, params }: RequestInfo) {
    console.log(ctx);
    console.log(params);
    return (
        <ShellLayout user={ctx.user!}>
            <h1>File Explorer</h1>
        </ShellLayout>
    )
}