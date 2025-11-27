'use client'
import React, { useState } from 'react'
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { deleteBannerImages } from '../action';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BannerImage } from '@/types/banner';
import extractStoragePath from '@/lib/extractStoragePath';

export default function DeleteBannerButton({
    bannerId,
    name,
    webImages = [],
    mobileImages = [],
}: {
    bannerId: string;
    name: string;
    webImages: BannerImage[];
    mobileImages: BannerImage[];

}) {
    const router = useRouter()
    const auth = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async () => {
        const token = await auth?.user?.getIdToken()
        if (!token) { return }
        setIsDeleting(true)
        try {
            const storageTasks: Promise<void>[] = [];

            const enqueueDelete = (image: BannerImage) => {
                const path = image.path ?? extractStoragePath(image.url);
                if (!path) { return; }
                storageTasks.push(deleteObject(ref(storage, path)));
            }

            webImages.forEach(enqueueDelete);
            mobileImages.forEach(enqueueDelete);

            await Promise.all(storageTasks)
            await deleteBannerImages({ bannerId }, token)
            toast.success("Success", {
                description: "All Banner images deleted successfully 👏🏼"
            })
            router.refresh() // ✅ 캐시 초기화
            router.push('/admin-dashboard/banners')
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete banner images")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                    <TrashIcon /> {name}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete all banner images ?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            This action cannot be undone. This will permanently delete this banner images.
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? " Deleting..." : "Delete Banner"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
