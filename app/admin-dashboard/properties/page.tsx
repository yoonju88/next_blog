import React from 'react'
import PropertyTable from './property-table'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'

export default async function PropertiesPage({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
}) {
    const searchParamsValue = await searchParams
    return (
        <div>
            <Breadcrumbs items={[
                {
                    href: "/admin-dashboard",
                    label: "Dashboard",
                },
                {

                    label: "Products",
                },
            ]}
            />
            <h1 className="text-4xl font-bold mt-6">Product setting</h1>
            <Button
                asChild
                className="inline-flex pl-2 gap-2 mt-4"
            >
                <Link href="/admin-dashboard/properties/new-property">
                    <PlusCircleIcon /> New Product
                </Link>
            </Button>
            <PropertyTable page={searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1} />
        </div>
    )
}
