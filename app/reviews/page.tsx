import React from 'react'
import EmptyList from '@/components/home/EmptyList'
import { getUserReviews } from '@/data/reviews'
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import Rating from '@/components/review/Rating';

export default async function ReviewsPage({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
}) {
    const searchParamsValue = await searchParams;
    const page = searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1

    const pageSize = 4
    const reviews = await getUserReviews();

    if (!reviews || reviews.length === 0) {
        return (
            <EmptyList
                title="No review found"
                message="You haven't written any reviews."
            />
        )
    }

    const totalPages = Math.ceil(reviews.length / pageSize)
    const paginatedReviews = reviews.slice(
        (page - 1) * pageSize,
        page * pageSize
    )
    if (paginatedReviews.length === 0 && page > 1) {
        redirect(`/reviews?page=${totalPages}`)
    }


    return (
        <div className="flex gap-10 w-full">
            {paginatedReviews.map((review) => (
                <Card key={review.id} className="w-[500px]">
                    <CardHeader className="px-0 flex">
                        <CardTitle>
                            <div className="relative w-full h-50">
                                {review.images && review.images.length > 0 ? (
                                    <Image
                                        src={imageUrlFormatter(review.images[0])}
                                        alt="main image"
                                        fill
                                        className="object-cover hover:scale-105 transition-all duration-300"
                                    />
                                ) : (
                                    <Image
                                        src="/fallback.jpg"
                                        alt="No image"
                                        fill
                                        className="bject-cover"
                                    />
                                )}
                            </div>
                            <h4>{review.comment}</h4>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription><Rating rating={review.rating} /></CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}