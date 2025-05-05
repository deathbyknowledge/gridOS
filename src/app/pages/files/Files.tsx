import ShellLayout from "@/app/layout/ShellLayout";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import { FileExplorer } from "./FileExplorer";
import { listFolder } from "./functions";

export async function Files({ ctx, params }: RequestInfo) {
    let path = decodeURIComponent(params.$0);
    if (path.endsWith("/")) {
        path = path.slice(0, -1);
    }
    const segments = path.split("/").filter(segment => segment && segment !== "");
    path = `/${segments.join("/")}/`;
    console.log('path', path);
    const entries = await listFolder(path);
    return (
        <ShellLayout user={ctx.user!}>
            <div className="h-[calc(100vh-64px)] w-full">
                <FileExplorer path={path} entries={entries} />
            </div>
        </ShellLayout>
    )
}
