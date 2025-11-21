'use client'

import Pagination from '@/components/admin/Pagination'
import { useRouter } from 'next/navigation'

type PropertyPaginationProps = {
    currentPage: number
    totalPages: number
    query: Record<string, string | undefined>
}

export default function PropertyPagination({ currentPage, totalPages, query }: PropertyPaginationProps) {
    const router = useRouter()

    if (totalPages <= 1) {
        return null
    }

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return
        const params = new URLSearchParams()
        Object.entries(query).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            }
        })
        params.set('page', String(page))
        router.push(`/property?${params.toString()}`)
    }

    return (
        <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
        </div>
    )
}

