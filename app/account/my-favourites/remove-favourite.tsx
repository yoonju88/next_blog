'use client'
import { Trash2Icon, TrashIcon } from "lucide-react"
import { removefavourite } from "@/app/property/[propertyId]/action"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"


export default function RemoveFavouriteButton({
    propertyId,
    className
}: {
    propertyId: string;
    className?: string;
}) {
    const auth = useAuth()
    const router = useRouter()

    return (
        <button
            className={className}
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
            <Trash2Icon />
        </button>
    )
}