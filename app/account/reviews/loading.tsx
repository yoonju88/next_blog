'use client'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function loading() {
    return (
        <section className='grid grid-cols-3 gap-8 mt-4'>
            <ReviewLoadingCard />
            <ReviewLoadingCard />
            <ReviewLoadingCard />
        </section>
    )
}

const ReviewLoadingCard = () => {
    return (
        <Card className="w-[400px] h-[150px] border-none">
            <CardHeader>
                <div className='flex items-center'>
                    <Skeleton className='w-12 h-12 rounded-full' />
                    <div className='ml-4'>
                        <Skeleton className='w-[260px] h-4 mb-3' />
                        <Skeleton className='w-[260px] h-4 mb-3' />
                        <Skeleton className='w-[260px] h-4 mb-3' />
                        <Skeleton className='w-[260px] h-4 mb-3' />
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}