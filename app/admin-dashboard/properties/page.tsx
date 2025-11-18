import React from 'react'
import PropertyTable from './property-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'
import { getProperties } from '@/lib/product'
import type { PromiseSearchParams } from '@/types/routes'
import { Suspense } from 'react'


export default async function PropertiesPage({
    searchParams
}: {
    searchParams: PromiseSearchParams
}) {
    const searchParamsValue = await searchParams;
    // string | string[] → string 유틸
    const pick = (key: string): string | undefined => {
        const v = searchParamsValue?.[key];
        return Array.isArray(v) ? v[0] : v;
    };

    const rawPage = pick("page") ?? '1'
    const page = Number.isFinite(Number(rawPage)) ? Number(rawPage) : 1;

    const { data, totalPages } = await getProperties({
        pagination: {
            page,
            pageSize: 6,
        }
    })

    return (
        <>
            <h1>Product setting</h1>
            <Button
                asChild
                className="inline-flex pl-2 gap-2 mt-4"
            >
                <Link href="/admin-dashboard/properties/new-property">
                    <PlusCircleIcon /> New Product
                </Link>
            </Button>
            <Suspense fallback={null}>
                <PropertyTable totalPages={totalPages} data={data} currentPage={page} />
            </Suspense>
        </>
    )
}
