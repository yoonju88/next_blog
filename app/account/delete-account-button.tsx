'use client'
import { removeToken } from "@/context/actions"
import { useAuth } from "@/context/auth"
import React, { useState } from 'react'
import { FirebaseError } from "firebase/app";
import {
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import { deleteUserFavourites } from "./action";


export default function DeleteAccountButton() {
    const auth = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [password, setPassword] = useState("");

    const handleDeleteClick = async () => {
        if (auth?.user?.email) {
            setIsDeleting(true)
            try {
                await reauthenticateWithCredential(
                    auth.user,
                    EmailAuthProvider.credential(auth.user.email, password)
                )
                await deleteUserFavourites()
                await deleteUser(auth.user)
                await removeToken()
                toast.success('', { description: "Your current was deleted successfully." });
            } catch (e: unknown) {
                if (e instanceof FirebaseError) {
                    if (e.code === "auth/invalid-credential") {
                        toast.error('', { description: "Your current password is incorrect" });
                    } else {
                        toast.error('', { description: "An error occurred" });
                    }
                } else {
                    toast.error('', { description: "An unexpected error occurred" });
                }
            }
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className='w-full'>
                    Delete account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete your account ?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data form our servers.
                            <div className="mt-2">
                                <Label>
                                    Enter current password to continue
                                </Label>
                                <Input
                                    className="mt-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? " Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}