import ShellLayout from "@/app/layout/ShellLayout";
import { RequestInfo } from "@redwoodjs/sdk/worker";


export function Chat({ctx }: RequestInfo) {
    return (
        <ShellLayout user={ctx.user!}>
            <h1>Shat</h1>
        </ShellLayout>
    )
}