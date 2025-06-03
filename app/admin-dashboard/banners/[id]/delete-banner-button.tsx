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
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';


export default function DeleteBannerButton({
    id,
    name,
}: {
    id: string;
    name: string;
}) {
    const router = useRouter()
    const auth = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async () => {
        const token = await auth?.currentUser?.getIdToken()
        if (!token) { return }
        setIsDeleting(true)

        await deleteBannerImages(id, token)
        setIsDeleting(false)
        router.push('/admin-dashboard')
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
