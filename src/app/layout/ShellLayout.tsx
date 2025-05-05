"use client";

import { AppSidebar } from "@/app/components/app-sidebar"
import { SiteHeader } from "@/app/components/site-header"
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar"

import { User } from "@prisma/client";

export default function ShellLayout({ user, children }: { user: User, children: React.ReactNode }) {
    return (
        <SidebarProvider className="dark">
            <AppSidebar user={user} variant="inset" className="shadow-lg"/>
            <div className="h-full-screen w-full relative">
                <SidebarInset className="h-full w-full">
                    <SiteHeader />
                    <div className="h-full w-full">
                         {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
};
