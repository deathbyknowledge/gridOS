"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/app/components/ui/breadcrumb";
import { link } from "@/app/shared/links";
import React from "react";


export function PathHeader({ path }: { path: string[] }) {
    // Generate breadcrumb items
    const breadcrumbItems = [
        { name: "", path: [] },
        ...path.map((folder, index) => ({
            name: folder,
            path: path.slice(0, index + 1),
        })),
    ]
    console.log('breadcrumbItems', breadcrumbItems);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment  key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => window.location.href = link('/files*', { '$0': `/${item.path.join('/')}` })} className="cursor-pointer hover:underline">
                                {item.name}/
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}