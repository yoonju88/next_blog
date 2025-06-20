'use client'

import { HeartIcon } from "lucide-react"
import { addFavourite, removefavourite } from "@/app/property/[propertyId]/action"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

export default function ToggleFavouriteButton({ propertyId, isFavourite: initialFavourite }: {
    propertyId: string;
    isFavourite: boolean;
}) {
    const auth = useAuth()
    const router = useRouter()
    const [isFavourite, setIsFavourite] = useState(initialFavourite)


    const toggleFavourite = async () => {
        if (!auth.user) {
            router.push("/login")
            return
        }

        const tokenResult = await auth?.user.getIdTokenResult()
        if (isFavourite) {
            await removefavourite(propertyId, tokenResult.token)
        } else {
            await addFavourite(propertyId, tokenResult.token)
        }
        toast.success("success", {
            description: `Product ${isFavourite ? "Remove from" : "Added to"} favourites`
        })
        setIsFavourite(!isFavourite)
        router.refresh()
    }

    return (
        <button
            className={`bg-none hover:scale-105 transition-all duration-300`}
            onClick={toggleFavourite}
        >
            <HeartIcon
                className={`text-muted-foreground w-7 h-7 ${isFavourite ? 'fill-pink-400 text-pink-400' : 'fill-white'}`}
            />
        </button>
    )
}