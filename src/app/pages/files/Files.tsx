import ShellLayout from "@/app/layout/ShellLayout";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import { FileExplorer } from "./FileExplorer";

export function Files({ ctx, params }: RequestInfo) {
    let path = params.$0;
    if (!path.endsWith("/")) {
        path += "/";
    }

    return (
        <ShellLayout user={ctx.user!}>
            <div className="h-[calc(100vh-64px)] w-full">
                <FileExplorer path={path} />
            </div>
        </ShellLayout>
    )
}
