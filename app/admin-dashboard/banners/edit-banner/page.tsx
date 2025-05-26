import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'

export default function EditBannerPage() {
    return (
        <div>
            <Breadcrumbs items={[
                {
                    href: "/admin-dashboard",
                    label: "Dashboard",
                },
                {
                    href: "/admin-dashboard/banners",
                    label: "Banners",
                }, {
                    label: "Edit Banners",
                },
            ]}
            />
            <h1 className="text-4xl font-bold mt-6 mb-6">Manage the Banner</h1>
            <BannerForm />
        </div>
    )
}
