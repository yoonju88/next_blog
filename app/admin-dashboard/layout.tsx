
import React from 'react'
import { AdminSidebar } from '@/components/admin/SideBar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar />
                {/* 메인 컨텐츠 영역 */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}
