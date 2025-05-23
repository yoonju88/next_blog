'use client'
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { deleteReview } from './action';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function RemoveReviewButton({
    reviewId,
    className
}: {
    reviewId: string;
    className: string;
}) {
    const auth = useAuth()
    const router = useRouter()

    return (
        <Button
            className={className}
            onClick={async () => {
                const tokenResult = await auth?.currentUser.getIdTokenResult()
                if (!tokenResult) return;
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
