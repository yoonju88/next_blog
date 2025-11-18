"use client"

import { useState } from "react";
import { useAuth } from "@/context/auth";
import { z } from "zod"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/client';
import { menuImageSchema } from "@/validation/menuImageSchema";
import { createMenuImage, updateMenuImage, deleteMenuImage } from "./action";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleImageUpload } from "@/components/admin/singleImageUpload";
import { Input } from "@/components/ui/input";
import imageDisplayUrlFormatter from "@/lib/imageDisplayUrlFormatter";


export default function MenuImageUploadForm() {

    const auth = useAuth()
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<z.infer<typeof menuImageSchema>>({
        resolver: zodResolver(menuImageSchema),
        defaultValues: {
            menuImage: {
                url: "",
                alt: "",
            }
        }
    })

    const uploadImage = async (file: File): Promise<{ url: string, path: string }> => {
        const path = `menu_images/main/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return { url, path }
    }

    const handleSubmit = async (data: z.infer<typeof menuImageSchema>) => {
        const token = await auth?.user?.getIdToken()
        if (!token) {
            toast.error("Authentication required.");
            return;
        }

        if (!data.menuImage.file) {
            toast.error("Please select an image");
            return;
        }

        setIsUploading(true);
        let imageId: string | null = null;

        try {
            // 1. Firestore에 임시 문서 생성
            const creationResponse = await createMenuImage({
                menuImage: {
                    url: '',
                    alt: data.menuImage.alt
                }
            }, token);

            if (creationResponse.error || !creationResponse.imageId) {
                throw new Error(creationResponse.message ?? "Error creating record");
            }

            imageId = creationResponse.imageId;

            // 2. Storage에 이미지 업로드
            const { url: uploadedUrl, path } = await uploadImage(data.menuImage.file);

            // 3. Firestore 문서 업데이트
            await updateMenuImage(
                {
                    imageId,
                    menuImage: {
                        url: uploadedUrl,
                        alt: data.menuImage.alt,
                        path
                    },
                },
                token
            );

            toast.success("Success! Image uploaded.");
            router.refresh();

        } catch (error) {
            console.error(error);
            if (imageId) {
                await deleteMenuImage({ imageId }, token);
            }
            toast.error(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setIsUploading(false);
        }
    }

    // 💡 실제 폼 UI는 여기에 구현되어야 합니다. (파일 선택, Alt 텍스트 입력 필드)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <fieldset disabled={isUploading} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="menuImage.alt"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Alt Text</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter image description..."
                                        {...field}
                                        className="lg:w-100 w-full "
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="menuImage"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className='my-2'>Menu Image</FormLabel>
                                <FormControl>
                                    <SingleImageUpload
                                        image={field.value}
                                        onImageChangeAction={(image) => {
                                            form.setValue("menuImage", image);
                                        }}
                                        urlFormatterAction={imageDisplayUrlFormatter}
                                        buttonName="Select Menu Image"
                                        displayWidth="w-full max-w-lg h-64"
                                        inputId="menu-image-upload"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>

                <Button
                    type="submit"
                    className="lg:w-100 w-full"
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
            </form>
        </Form>
    )
}