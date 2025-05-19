'use client'
import { TrashIcon } from "lucide-react"
import { addFavourite, removefavourite } from "@/app/property/[propertyId]/action"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"


export default function RemoveFavouriteButton({
    propertyId
}: {
    propertyId: string;
}) {
    const auth = useAuth()
    const router = useRouter()

    return (
        <Button
            variant="outline"
            className="absolute top-3 bottom-0 right-3"
            onClick={async () => {
                const tokenResult = await auth?.currentUser?.getIdTokenResult()
                if (!tokenResult) { return }
                await removefavourite(propertyId, tokenResult.token)
                toast.success("success", {
                    description: "This product was removed from favourites lists."
                })
                router.refresh()
            }}
        >
            <TrashIcon />
        </Button>
    )
}