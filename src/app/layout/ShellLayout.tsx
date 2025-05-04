"use client";

import { AppSidebar } from "@/app/components/app-sidebar"
import { SiteHeader } from "@/app/components/site-header"
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar"

import { User } from "@prisma/client";

export default function ShellLayout({ user, children }: { user: User, children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar user={user} variant="inset" />
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
};
