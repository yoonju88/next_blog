'use client'
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { deleteReview } from './action';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '@/firebase/client';

export default function RemoveReviewButton({
    reviewId,
    className,
    images
}: {
    reviewId: string;
    className: string;
    images: string[];
}) {
    const auth = useAuth()
    const router = useRouter()
    //console.log('images Data', images)

    return (
        <Button
            className={className}
            onClick={async () => {
                const tokenResult = await auth?.user.getIdTokenResult()
                if (!tokenResult) return;
                const storageTasks: Promise<void>[] = [];
                images.forEach(image => {
                    storageTasks.push(deleteObject(ref(storage, image)))
                })
                await Promise.all(storageTasks)
                await deleteReview(reviewId, tokenResult.token)
                toast.success("success", {
                    description: "This review was removed from the review list."
                })
                router.refresh()
            }}
        >
            <Trash2Icon />
        </Button>
    )
}
