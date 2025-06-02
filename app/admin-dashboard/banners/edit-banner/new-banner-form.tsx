"use client"

import { useAuth } from "@/context/auth";
import { z } from "zod"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, UploadTask, getDownloadURL, } from 'firebase/storage';
import { storage } from '@/firebase/client';
import { PlusCircleIcon } from "lucide-react";
import { bannerImageSchema } from "@/validation/bannerSchema";
import { createBanner, saveBannerImages } from "../action";
import BannerForm from "../banner-form";

export default function NewBannerForm() {
    const auth = useAuth();
    const router = useRouter()

    const handleSubmit = async (data: z.infer<typeof bannerImageSchema>) => {
        const token = await auth?.currentUser?.getIdToken()

        if (!token) { return; }

        // File 객체를 제거하고 필요한 데이터만 전달
        const cleanData = {
            webImages: data.webImages.map(img => ({
                id: img.id,
                url: img.url
            })),
            mobileImages: data.mobileImages.map(img => ({
                id: img.id,
                url: img.url
            }))
        };

        const response = await createBanner(cleanData, token)
        if (response.error || !response.bannerId) {
            toast.error(response.message ?? "Error creating banner")
            return
        }
        const bannerId = response.bannerId
        const uploadedUrls: string[] = []

        const uploadTasks = [...data.webImages, ...data.mobileImages].map((image, idx) => {
            if (!image.file) return Promise.resolve();

            const path = `banners/${bannerId}/${Date.now()}-${idx}-${image.file.name}`;
            const storageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(storageRef, image.file);

            return new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    () => { }, // Optional progress handler
                    reject,
                    async () => {
                        const url = await getDownloadURL(storageRef);
                        uploadedUrls.push(url);
                        resolve();
                    }
                );
            });
        });


        await Promise.all(uploadTasks)
        await saveBannerImages({ bannerId, images: uploadedUrls }, token)

        toast.success("Success! Banner images uploaded.")
        router.push('/admin-dashboard/banners')
    }
    return (
        <div>
            <BannerForm
                handleSubmitAction={handleSubmit}
                submitButtonLabel={
                    <>
                        <PlusCircleIcon /> Add Banner
                    </>
                }
            />
        </div>
    )
}
