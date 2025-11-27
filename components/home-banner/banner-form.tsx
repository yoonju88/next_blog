"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import BannerMultiImageUpload from '@/components/home-banner/Banner-multi-upload'
import { bannerImageSchema } from '@/validation/bannerSchema'
import { ImageUpload } from '@/types/image'
import imageDisplayUrlFormatter from "@/lib/imageDisplayUrlFormatter";

type Props = {
    submitButtonLabel: React.ReactNode;
    handleSubmitAction: (data: z.infer<typeof bannerImageSchema>) => void;
    defaultValues?: Partial<z.infer<typeof bannerImageSchema>>
}

export default function BannerForm({
    handleSubmitAction,
    submitButtonLabel,
    defaultValues,
}: Props) {
    const combinedDefaultValues: z.infer<typeof bannerImageSchema> = {
        ...defaultValues,
        webImages: defaultValues?.webImages ?? [],
        mobileImages: defaultValues?.mobileImages ?? [],
    }

    const form = useForm<z.infer<typeof bannerImageSchema>>({
        resolver: zodResolver(bannerImageSchema),
        defaultValues: combinedDefaultValues,
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitAction)}>
                <fieldset className="flex flex-col gap-6" >
                    <FormField
                        control={form.control}
                        name="webImages"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <BannerMultiImageUpload
                                        onImagesChangeAction={(images: ImageUpload[]) => {
                                            form.setValue("webImages", images)
                                        }}
                                        images={field.value ?? []}
                                        urlFormatterAction={imageDisplayUrlFormatter}
                                        buttonName="Upload for Web"
                                        displayWidth="w-[1024px] h-[300px]"
                                        inputId="web-banner-upload"
                                        name="webImages"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobileImages"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <BannerMultiImageUpload
                                        onImagesChangeAction={(images: ImageUpload[]) => {
                                            form.setValue("mobileImages", images)
                                        }}
                                        images={field.value ?? []}
                                        urlFormatterAction={imageDisplayUrlFormatter}
                                        buttonName="Upload for Mobile"
                                        displayWidth="w-[500px] h-[500px]"
                                        inputId="mobile-banner-upload"
                                        name="mobileImages"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>
                <Button
                    type="submit"
                    className="max-w-md mx-auto mt-4 w-full flex gap-2"
                    disabled={form.formState.isSubmitting}

                >
                    {submitButtonLabel}
                </Button>
            </form>
        </Form >
    )
}
