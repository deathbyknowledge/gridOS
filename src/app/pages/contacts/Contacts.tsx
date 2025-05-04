import ShellLayout from "@/app/layout/ShellLayout";
import { RequestInfo } from "@redwoodjs/sdk/worker";


export function Contacts({ ctx}: RequestInfo) {
    return (
        <ShellLayout user={ctx.user!}>
            <h1>Contacts</h1>
        </ShellLayout>
    )
}