'use client'

import { useState } from "react"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"

interface ConfirmDeleteButtonProps {
    onConfirmAction: () => Promise<void>
    title?: string
    description?: string
    buttonText?: string
    icon?: React.ReactNode
    variant?: "default" | "destructive" | "outline"
    size?: "default" | "icon" | "sm"
    disabled?: boolean
}

export default function ConfirmDeleteButton({
    onConfirmAction,
    title = "Are you sure you want to delete?",
    description = "This action cannot be undone.",
    buttonText = "Delete",
    icon = <TrashIcon className="w-4 h-4" />,
    variant = "destructive",
    size = "icon",
    disabled = false,
}: ConfirmDeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleConfirm = async () => {
        setIsDeleting(true)
        await onConfirmAction()
        setIsDeleting(false)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} size={size} disabled={disabled}>
                    {icon}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        variant={variant}
                    >
                        {isDeleting ? "Deleting..." : buttonText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
