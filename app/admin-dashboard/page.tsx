import React from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import type { PromiseSearchParams } from '@/types/routes'

export default async function AdminDashboard({
    searchParams
}: {
    searchParams?: PromiseSearchParams
}) {
    const searchParamsValue = await searchParams

    return (
        <div>
            <h1 className="text-4xl font-bold mt-6">Admin Dashboard</h1>
            <p className="text-lg text-red-500/80 mt-4"> This page is not available yet. Development is in progress. </p>
            <div className="flex gap-4 mt-6 text-lg uppercase font-semibold text-foreground/70">
                <p > Today’s Orders</p>
                <p> Today’s Revenue</p>
                <p> This Week’s Revenue</p>
                <p>New Members</p>
                <p>Visitors</p>
            </div>

        </div >
    )
}
