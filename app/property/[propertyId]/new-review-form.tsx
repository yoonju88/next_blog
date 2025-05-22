"use client"

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { reviewSchema, reviewDataSchema } from '@/validation/reviewSchema'
import { z } from "zod"
import { createReview, saveReviewImages } from "../../reviews/action"
import { toast } from 'sonner'
import { ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { storage } from '@/firebase/client';
import ReviewForm from "@/components/review/review-form"

export function NewReviewForm({ propertyId }: { propertyId: string }) {
    const auth = useAuth();
    const router = useRouter()

    const handleSubmit = async (data: z.infer<typeof reviewSchema>) => {
        const token = await auth?.currentUser?.getIdToken()

        if (!token) {
            return (
                router.push('/login')
            )
        }
        const { images, ...rest } = data
        const validatedData = reviewDataSchema.parse(rest) as {
            rating: number;
            comment: string;
        }
        const response = await createReview(propertyId, token, validatedData)

        if (!!response.error || !response.reviewId) {
            toast.error("Error!", {
                description: response.message,
            });
            return;
        }
        const uploadTasks: UploadTask[] = []
        const paths: string[] = []

        images.forEach((image, index) => {
            if (image.file) {
                const path = `reviews/${response.reviewId}/${Date.now()}-${index}-${image.file.name}`
                paths.push(path);
                const storateRef = ref(storage, path)
                uploadTasks.push(uploadBytesResumable(storateRef, image.file))
            }
        })
        await Promise.all(uploadTasks)
        await saveReviewImages(
            { reviewId: response.reviewId, images: paths },
            token
        )
        toast.success("Success!", {
            description: "Review added successfully",
        });
        router.push(`/property/${propertyId}`)
    }

    return (
        <ReviewForm
            handleSubmitAction={handleSubmit}
        />
    )
}