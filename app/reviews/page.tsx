import React from 'react'
import EmptyList from '@/components/EmptyList'
import { getUserReviews } from '@/lib/reviews'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import { formatDistanceToNow } from 'date-fns'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RemoveReviewButton from './remove-review-button';

export default async function ReviewsPage({
    searchParams
}: {
    searchParams?: Promise<Record<string, string | undefined>>
}) {

    const searchParamsValue = await searchParams;
    const page = searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1

    const pageSize = 4
    const reviews = await getUserReviews()

    if (!reviews || reviews.length === 0) {
        return (
            <EmptyList
                title="Be the first to leave a review!"
                description="We'd love to hear what you think. Write a review!"
                buttonHref='/'
                buttonText="Return to Home page"
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
        <section className="w-full mx-auto container px-10 py-10">
            <h1 className="font-title font-semibold text-3xl mb-10">Your Review list.</h1>
            <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-10 ">
                {paginatedReviews.map((review) => {
                    const createdAtDate = review.createdAt
                        ? new Date(review.createdAt.seconds * 1000)
                        : null;
                    const relativeTime = createdAtDate
                        ? formatDistanceToNow(createdAtDate, { addSuffix: true })
                        : '';
                    const images = review.images || [];

                    return (
                        <div key={review.id} className="relative w-full flex py-4 px-4 bg-white rounded-xl border-1 border-foreground/20 shadow-sm shadow-foreground/20">
                            <div className="flex flex-col w-[80%] text-gray-800 space-y-2">
                                <div className="flex gap-4 items-center">
                                    <div className="p-4 bg-gray-300 rounded-2xl relative overflow-hidden">
                                        {review.userPhotoURL && (
                                            <Image src={review.userPhotoURL} alt="user avatar" className="object-cover" fill />
                                        )}
                                    </div>
                                    <h3 className="font-semibold ">{review.userName}</h3>
                                </div>
                                <p className="font-semibold text-primary">Product Name : {review.propertyName}</p>
                                <div className="flex gap-2 items-center text-sm">
                                    <p className="font-semibold text-primary">{review.rating}/5</p>
                                    <p className="capitalize text-gray-600">{relativeTime}</p>
                                </div>
                                <p className="mb-4">{review.comment}</p>
                            </div>
                            <div className="relative w-full overflow-hidden">
                                {images && images.length > 0 && (
                                    <Carousel className="w-full h-full">
                                        <CarouselContent>
                                            {images.length > 0 &&
                                                images.map((image, index) => (
                                                    <CarouselItem key={image}>
                                                        <div className="relative h-[150px] w-full">
                                                            <Image
                                                                src={imageUrlFormatter(image)}
                                                                alt={`Image ${index + 1}`}
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                className="object-cover object-center rounded group-hover:scale-105 transition-all duration-300"
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                        </CarouselContent>
                                        {images.length > 1 && (
                                            <>
                                                <CarouselPrevious className="translate-x-16 size-12" />
                                                <CarouselNext className="-translate-x-16 size-12" />
                                            </>
                                        )}
                                    </Carousel>
                                )}
                            </div>
                            <RemoveReviewButton
                                reviewId={review.id}
                                className="absolute top-4 right-4 bg-gray-100 shadow-sm shadow-foreground/20 p-1.5 rounded-md text-foreground  hover:shadow-inner duration-300 transition-all"
                                images={images}
                            />
                        </div>
                    );
                })}
            </div >
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                        key={i}
                        asChild={page !== i + 1} // 현재 페이지가 아닐 때만 asChild 적용
                        variant="outline"
                        className='mx-1'
                        disabled={page === i + 1} // 현재 페이지 버튼은 비활성화
                    >
                        <Link href={`/reviews?page=${i + 1}`}>{i + 1}</Link>
                    </Button>
                ))}
            </div>
        </section>
    );
}
