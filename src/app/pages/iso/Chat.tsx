import ShellLayout from "@/app/layout/ShellLayout";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import ChatInterface from "./ChatInterface";


export function Chat({ctx }: RequestInfo) {
    return (
        <ShellLayout user={ctx.user!}>
            <ChatInterface />
        </ShellLayout>
    )
}