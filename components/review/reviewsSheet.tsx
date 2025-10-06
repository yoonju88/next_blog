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
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-foreground underline underline-offset-2 mt-2 hover:text-primary hover:font-semibold transition-all duration-300 ease-in-out">See all Reviews</button>
            </SheetTrigger>
            <SheetContent className='p-4'>
                <SheetHeader>
                    <SheetTitle>Review List</SheetTitle>
                    <SheetDescription>
                        Check out the reviews for this product.
                    </SheetDescription>
                </SheetHeader>
                {safeReviews.map((review) => {
                    const images = Array.isArray(review.images) ? review.images : []
                    return (
                        <div key={review.id} className="px-4 pb-4 border-b border-foreground/30">
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
                            <div className="w-ful overflow-hidden mt-4">
                                {images.length > 0 && (
                                    <SlideImages
                                        images={images}
                                        imageH="min-h-[100px]"
                                    />
                                )}
                            </div>
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
