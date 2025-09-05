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

export default function DeleteBannerButton({
    bannerId,
    name,
    webImages = [],
    mobileImages = [],
}: {
    bannerId: string;
    name: string;
    webImages: string[];
    mobileImages: string[];

}) {
    const router = useRouter()
    const auth = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async () => {
        const token = await auth?.user?.getIdToken()
        if (!token) { return }
        setIsDeleting(true)
        const storageTasks: Promise<void>[] = [];

        webImages.forEach((pathOrUrl) => {
            storageTasks.push(deleteObject(ref(storage, pathOrUrl)));
        });
        mobileImages.forEach((pathOrUrl) => {
            storageTasks.push(deleteObject(ref(storage, pathOrUrl)));
        });

        // webImages.forEach(image => {
        //     const path = typeof image === "string" ? image : image.path
        //     storageTasks.push(deleteObject(ref(storage, path)))
        // })
        // mobileImages.forEach(image => {
        //     const path = typeof image === "string" ? image : image.path
        //     storageTasks.push(deleteObject(ref(storage, path)))
        //})

        await Promise.all(storageTasks)
        await deleteBannerImages({ bannerId }, token)
        setIsDeleting(false)
        toast.success("Success", {
            description: "All Banner images deleted successfully 👏🏼"
        })
        router.push('/admin-dashboard/banners/new-banner')
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
