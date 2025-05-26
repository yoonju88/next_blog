import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'

export default function BannerPage() {
    return (
        <div>
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
            <h1 className="text-4xl font-bold mt-6 mb-6">Admin Banner manage</h1>
            <Button
                asChild
                className="flex-inline gap-2"
            >
                <Link href="/admin-dashboard/banners/edit-banner">
                    <PlusCircleIcon />New Banner
                </Link>
            </Button>
        </div>
    )
}
