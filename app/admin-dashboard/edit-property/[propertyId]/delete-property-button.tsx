'use client'

import { useAuth } from "@/context/auth"
import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { TrashIcon } from "lucide-react";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/firebase/client";
import { DeleteProduct } from "./action";
import { useRouter } from "next/navigation"


export default function DeletePropertyButton({
    propertyId,
    images = []
}: {
    propertyId: string;
    images?: string[];
}) {
    const router = useRouter()
    const auth = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async () => {
        const token = await auth?.currentUser?.getIdToken()
        if (!token) { return }
        setIsDeleting(true)
        const storageTasks: Promise<void>[] = [];

        images.forEach(image => {
            storageTasks.push(deleteObject(ref(storage, image)))
        })
        await Promise.all(storageTasks)
        await DeleteProduct(propertyId, token)
        setIsDeleting(false)
        router.push('/admin-dashboard')
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <TrashIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this property ?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            This action cannot be undone. This will permanently delete this property.
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? " Deleting..." : "Delete Property"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
