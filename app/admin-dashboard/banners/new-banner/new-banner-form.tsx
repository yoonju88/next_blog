"use client"

import { useAuth } from "@/context/auth";
import { z } from "zod"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, UploadTask, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/client';
import { PlusCircleIcon } from "lucide-react";
import { bannerImageSchema } from "@/validation/bannerSchema";
import { createBanner, saveBannerImages } from "../action";
import BannerForm from "../../../../components/home-banner/banner-form";

export default function NewBannerForm() {
    const auth = useAuth();
    const router = useRouter()

    const handleSubmit = async (data: z.infer<typeof bannerImageSchema>) => {
        const token = await auth?.currentUser?.getIdToken()
        if (!token) { return; }

        const uploadImage = async (
            image: { id: string; file?: File },
            bannerId: string,
            idx: number
        ): Promise<{ id: string; url: string, path: string }> => {
            if (!image.file) throw new Error("No file to upload");
            const path = `banners/${bannerId}/${Date.now()}-${idx}-${image.file.name}`;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, image.file);
            const url = await getDownloadURL(storageRef);
            return { id: image.id, url, path }
        }

        // 먼저 배너 문서만 생성 (빈 상태)
        const tempBannerResponse = await createBanner({ webImages: [], mobileImages: [] }, token);
        if (tempBannerResponse.error || !tempBannerResponse.bannerId) {
            toast.error(tempBannerResponse.message ?? "Error creating banner");
            return;
        }
        const bannerId = tempBannerResponse.bannerId;
        const uploadWebImages: { id: string; url: string; path: string; }[] = [];
        const uploadMobileImages: { id: string; url: string; path: string; }[] = [];


        // 이미지 업로드 후 URL 추출
        for (let i = 0; i < data.webImages.length; i++) {
            const uploaded = await uploadImage(data.webImages[i] as { id: string; file?: File }, bannerId, i);
            uploadWebImages.push(uploaded);
        }

        for (let i = 0; i < data.mobileImages.length; i++) {
            const uploaded = await uploadImage(data.mobileImages[i] as { id: string; file?: File }, bannerId, i);
            uploadMobileImages.push(uploaded);
        }
        // URL이 포함된 상태로 배너 문서 업데이트
        await saveBannerImages(
            {
                bannerId,
                webImages: uploadWebImages,
                mobileImages: uploadMobileImages
            }, token
        )
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
