"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton() {
    const router = useRouter();
    return (
        <Button
            variant="link"
            onClick={() => router.back()}
            className=" group hover:no-underline hover:font-semibold"
        >
            <ArrowLeftIcon /> Return
        </Button>
    )
}