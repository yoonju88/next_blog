"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
    { href: "/admin-dashboard/properties", label: "Products & sale" },
    { href: "/admin-dashboard/orders", label: "Orders" },
    { href: "/admin-dashboard/coupons", label: "Coupons" },
    { href: "/admin-dashboard/banners", label: "Banners" },
    { href: "/admin-dashboard/menu-image", label: "Menu Image" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar className="lg:w-60 w-50" collapsible="none">
            <SidebarContent>
                <SidebarGroup className="mt-10">
                    <SidebarGroupLabel className="text-extrabold text-lg uppercase mb-10">
                        <Link href='/admin-dashboard'>
                            Amin dashboard
                        </Link>
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={item.href}>
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}