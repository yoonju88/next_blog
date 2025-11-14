import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Avatar } from "@/components/ui/avatar"
import SlideImages from "@/components/carousel"
import { useAuth } from "@/context/auth"
import RemoveReviewButton from "@/app/account/reviews/remove-review-button"

type Review = {
    id: string;
    propertyId: string;
    userId: string;
    rating: number;
    comment: string;
    userName: string;
    userPhotoURL: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
};

interface ReviewsProps {
    reviews?: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {

    const safeReviews = Array.isArray(reviews) ? reviews : []
    const auth = useAuth()
    const currentUserId = auth?.user?.uid

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-foreground underline underline-offset-2 mt-2 hover:text-primary hover:font-semibold transition-all duration-300 ease-in-out">See all Reviews</button>
            </SheetTrigger>
            <SheetContent className='p-4'>
                <SheetHeader>
                    <SheetTitle>All Reviews</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                {safeReviews.map((review) => {
                    const images = Array.isArray(review.images) ? review.images : []
                    const isCurrentUserReview = review.userId === currentUserId

                    return (
                        <div key={review.id} className="px-4 pb-4 border-b border-foreground/30 relative">
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <Image
                                        src={review.userPhotoURL ? review.userPhotoURL : "/default-avatar.jpg"}
                                        alt="User avatar"
                                        width={70}
                                        height={70}
                                    />
                                </Avatar>
                                <p>{review.userName}</p>
                            </div>
                            <span className="mt-2 text-sm text-foreground font-medium">{review.rating}/5</span>
                            <p className="mt-2">{review.comment}</p>
                            <div className="w-full overflow-hidden mt-4">
                                {images.length > 0 && (
                                    <SlideImages
                                        images={images}
                                        imageH="min-h-[100px]"
                                    />
                                )}
                            </div>

                            {/* 현재 유저 리뷰면 삭제 버튼 */}
                            {isCurrentUserReview && (
                                <RemoveReviewButton
                                    reviewId={review.id}
                                    className="absolute top-4 right-4 bg-gray-100 shadow-foreground/30 p-1.5 rounded-md text-foreground 
                                    hover:text-primary hover:shadow-inner duration-300 transition-all"
                                    images={images}
                                />
                            )}
                        </div>
                    )
                })}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
