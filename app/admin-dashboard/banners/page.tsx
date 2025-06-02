import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import BannersTable from './banners-table'


export default function BannerPage() {
    return (
        <>
            <Breadcrumbs items={[
                {
                    href: "/admin-dashboard",
                    label: "Dashboard",
                },
                {
                    label: "Banners",
                },
            ]}
            />
            <BannersTable />
        </>
    )
}
