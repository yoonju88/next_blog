import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from 'react';
import { Button } from './ui/button';

export default function Modal({
    title, description, children
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    {title}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
