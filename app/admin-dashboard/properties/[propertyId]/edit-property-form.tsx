"use client"
import { useState } from "react"
import PropertyForm from "@/components/forms/property-form"
import { Property, UpdatePropertyInput } from "@/types/property"
import { propertySchema } from "@/validation/propertySchema"
import { z } from "zod"
import { useAuth } from "@/context/auth"
import { updateProperty } from "./action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteObject, ref, UploadTask, uploadBytesResumable } from "firebase/storage"
import { storage } from "@/firebase/client"
import { savePropertyImages } from "../../action"
import { SaveIcon } from "lucide-react"

export default function EditPropertyForm({
    id,
    name,
    price,
    costPrice,
    category,
    subCategory,
    origin,
    manufacturer,
    volume,
    description,
    status,
    brand,
    ingredients,
    skinType,
    skinBenefit,
    howToUse,
    expireDate,
    stockQuantity,
    updated,
    created,
    weight,
    soldQuantity,
    images = [],
}: Property) {

    const auth = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
        const token = await auth?.user?.getIdToken();
        if (!token) { return; }

        const { images: newImages, ...rest } = data;

        const response = await updateProperty({
            ...rest,
            id,
        }, token)
        if (!!response?.error) {
            toast.error("Error", { description: response.message })
            return
        }

        const storageTasks: (UploadTask | Promise<void>)[] = []
        const imagesToDelete = images
            .filter(
                image => newImages
                    .find(
                        newImage => image === newImage
                    )
            )

        imagesToDelete.forEach(image => {
            storageTasks.push(deleteObject(ref(storage, image)))
        })

        const paths: string[] = []
        newImages.forEach((image, index) => {
            if (image.file) {
                const path = `property/${id}/${Date.now()}-${index}-${image.file.name}`;
                paths.push(path);
                const storageRef = ref(storage, path)
                storageTasks.push(uploadBytesResumable(storageRef, image.file));
            } else {
                paths.push(image.url)
            }
        })
        await Promise.all(storageTasks)
        await savePropertyImages({ propertyId: id, images: paths }, token)

        toast.success("Success", {
            description: "Property updated successfully 👏🏼"
        })
        router.push('/admin-dashboard')
    }

    return (
        <div className="w-full">
            <PropertyForm
                handleSubmitAction={handleSubmit}
                submitButtonLabel={
                    <> <SaveIcon /> Save Property</>
                }
                defaultValues={{
                    name,
                    price,
                    costPrice,
                    category: Array.isArray(category) ? category[0] : category ?? undefined,
                    subCategory,
                    origin,
                    manufacturer,
                    volume,
                    description,
                    brand,
                    ingredients,
                    skinType: Array.isArray(skinType) ? skinType[0] : skinType ?? undefined,
                    skinBenefit,
                    howToUse,
                    expireDate,
                    stockQuantity,
                    weight,
                    images: images.map(image => ({
                        id: image,
                        url: image,
                        file: undefined
                    })),
                }}
            />
        </div>
    )
}