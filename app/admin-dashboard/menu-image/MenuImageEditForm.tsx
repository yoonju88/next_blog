"use client"

import { useAuth } from "@/context/auth";
import { z } from "zod"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase/client';
import { updateMenuImage, deleteMenuImage } from "./action";
import { ImageDataType } from "@/types/image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuImageSchema } from "@/validation/menuImageSchema";
import { Input } from "@/components/ui/input";
import { SingleImageUpload } from "@/components/admin/singleImageUpload";
import { useState } from "react";

export default function MenuImageEditForm({ image }: { image: ImageDataType }) {
    const auth = useAuth()
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<z.infer<typeof menuImageSchema>>({
        resolver: zodResolver(menuImageSchema),
        defaultValues: {
            menuImage: {
                url: image.url,
                alt: image.alt,
                path: image.path,
            }
        }
    })

    const handleUpdate = async (data: z.infer<typeof menuImageSchema>) => {
        const token = await auth?.user?.getIdToken()
        if (!token) {
            toast.error("Authentication required.");
            return;
        }

        setIsUpdating(true);

        try {
            let newUrl = image.url;
            let newPath = image.path;

            // 새 파일이 업로드된 경우
            if (data.menuImage.file) {
                // 기존 파일 삭제
                if (image.path) {
                    try {
                        const oldRef = ref(storage, image.path);
                        await deleteObject(oldRef);
                    } catch (error) {
                        console.warn("Old image deletion failed:", error);
                    }
                }

                // 새 파일 업로드
                const path = `menu_images/main/${Date.now()}-${data.menuImage.file.name}`;
                const storageRef = ref(storage, path);
                await uploadBytes(storageRef, data.menuImage.file);
                newUrl = await getDownloadURL(storageRef);
                newPath = path;
            }

            // Firestore 문서 업데이트
            await updateMenuImage(
                {
                    imageId: image.id,
                    menuImage: {
                        url: newUrl,
                        path: newPath,
                        alt: data.menuImage.alt,
                    },
                },
                token
            );

            toast.success("Image successfully updated!");
            router.refresh();

        } catch (error) {
            console.error("Update error:", error);
            toast.error(error instanceof Error ? error.message : "Update failed");
        } finally {
            setIsUpdating(false);
        }
    }

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this image? This action cannot be undone.");
        if (!confirmed) return;

        const token = await auth?.user?.getIdToken();
        if (!token) {
            toast.error("Authentication required.");
            return;
        }

        setIsDeleting(true);

        try {
            // Storage 파일 삭제
            if (image.path) {
                try {
                    const storageRef = ref(storage, image.path);
                    await deleteObject(storageRef);
                } catch (error) {
                    console.warn("Storage deletion failed:", error);
                }
            }

            // Firestore 문서 삭제
            await deleteMenuImage({ imageId: image.id }, token);

            toast.success("Image successfully deleted.");
            router.refresh();

        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error instanceof Error ? error.message : "Delete failed");
        } finally {
            setIsDeleting(false);
        }
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
                <fieldset disabled={isUpdating || isDeleting}>
                    <div className="mb-6">
                        <h3 className="text-md font-semibold mb-2">Uploaded Image</h3>
                        <div className="relative w-full max-w-lg h-64 border rounded-lg overflow-hidden">
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="text-sm text-foreground/80 text-center mt-2"> {image.alt} </p>
                    </div>
                    <FormField
                        control={form.control}
                        name="menuImage.alt"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-foreground/80">Modifier Text</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter image description..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>
                <div className="flex gap-4 mb-2">
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={isUpdating || isDeleting}
                    >
                        {isUpdating ? "Updating..." : "Update Image"}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isUpdating || isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}