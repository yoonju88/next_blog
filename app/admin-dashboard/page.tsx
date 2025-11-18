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
            <div className="flex gap-4 mt-6">
                <p>  오늘의 주문 수 </p>
                <p>  오늘의 매출 </p>
                <p>  이번주 매출  </p>
                <p>  신규회원  </p>
                <p> 방문자수  </p>
            </div>

        </div >
    )
}
