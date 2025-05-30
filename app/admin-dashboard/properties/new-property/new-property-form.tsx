"use client"

import PropertyForm from '@/components/property-form'
import { useAuth } from "@/context/auth";
import { propertyDataSchema, propertySchema } from '@/validation/propertySchema'
import { z } from "zod"
import { createProperty } from './action'
import { savePropertyImages } from '../../action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { storage } from '@/firebase/client';
import { PlusCircleIcon } from "lucide-react";

export default function NewPropertyForm() {
    const auth = useAuth();
    const router = useRouter()

    const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
        const token = await auth?.currentUser?.getIdToken()

        if (!token) { return; }

        const { images, ...rest } = data
        const validatedData = propertyDataSchema.parse(rest) as {
            name: string;
            price: number;
            costPrice: number;
            category: string;
            subCategory: string;
            origin: string;
            manufacturer: string;
            volume: number;
            description: string;
            status: "Available" | "Sold Out" | "Limited edition";
            ingredients: string;
            keyIngredients: string;
            skinType: "Oily Skin" | "Dry Skin" | "Combination Skin" | "Sensitive Skin" | "Normal Skin";
            howToUse: string;
            expireDate: string;
            stockQuantity: number;
        }
        const response = await createProperty(validatedData, token)

        if (!!response.error || !response.propertyId) {
            toast.error("Error!", {
                description: response.message,
            });
            return;
        }

        const uploadTasks: UploadTask[] = [];
        const paths: string[] = [];

        images.forEach((image, index) => {
            console.log(`Step 5: Image ${index}:`, image);
            if (image.file) {
                const path = `properties/${response.propertyId
                    }/${Date.now()}-${index}-${image.file.name}`;
                paths.push(path);
                const storageRef = ref(storage, path);
                uploadTasks.push(uploadBytesResumable(storageRef, image.file));
            }
        })

        await Promise.all(uploadTasks)
        await savePropertyImages(
            { propertyId: response.propertyId, images: paths },
            token
        )
        toast.success("Success!", {
            description: "Product added successfully",
        });
        router.push('/admin-dashboard/properties')

        console.log("Auth State:", auth);
        console.log("Current User:", auth?.currentUser);
        console.log("Token:", token);
    }
    return (
        <div>
            <PropertyForm
                handleSubmitAction={handleSubmit}
                submitButtonLabel={
                    <>
                        <PlusCircleIcon /> Add Product
                    </>
                }
            />
        </div>
    )
}
