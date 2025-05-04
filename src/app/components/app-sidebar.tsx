"use client";

import * as React from "react"
import {
  IconDatabase,
  IconFileWord,
  IconMatrix,
  IconRobot,
  IconReport,
  IconSearch,
  IconSettings,
  IconAddressBook,
  IconFolders
} from "@tabler/icons-react"

import { NavMain } from "@/app/components/nav-main"
import { NavUser } from "@/app/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"
import { User } from "@prisma/client";
import { link } from "../shared/links";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/deathbyknowledge.png",
  },
  navMain: [
    {
      title: "Files",
      url: link("/files/*", { '$0': "/" }),
      icon: IconFolders,
    },
    {
      title: "ISO",
      url: link("/iso"),
      icon: IconRobot,
    },
    {
      title: "Neighbours",
      url: link("/contacts"),
      icon: IconAddressBook,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href={link("/")}>
                <IconMatrix className="!size-5" />
                <span className="text-base font-semibold">GridOS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
