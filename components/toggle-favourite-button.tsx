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

        try {
            const tokenResult = await auth?.user.getIdTokenResult()
            const token = tokenResult?.token
            if (!token) {
                toast.error("Auth error", { description: "Please login again" })
                router.push("/login")
                return
            }
            const res = isFavourite
                ? await removefavourite(propertyId, token)
                : await addFavourite(propertyId, token)

            if (!res?.ok) {
                toast.error("Failed", { description: res?.message || "Try again later" })
                return
            }

            toast.success("success", {
                description: `Product ${isFavourite ? "Remove from" : "Added to"} favourites`
            })
            setIsFavourite(!isFavourite)
            router.refresh()
        } catch (e) {
            toast.error("Unexpected error", { description: "Please try again" })
        }
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