
"use client"

import React from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import BannerMultiImageUpload, { ImageUpload } from '@/components/home-banner/Banner-multi-upload'
import { bannerImageSchema } from '@/validation/bannerSchema'

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
        webImages: [],
        mobileImages: [],
        ...defaultValues,
    }

    const form = useForm<z.infer<typeof bannerImageSchema>>({
        resolver: zodResolver(bannerImageSchema),
        defaultValues: combinedDefaultValues,
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitAction)}>
                <fieldset className="flex flex-col gap-6" disabled={form.formState.isSubmitting}>
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
                                        urlFormatter={(image) => {
                                            // 새로 업로드한 이미지라면 미리보기 URL 사용
                                            if (image.file) return image.url;
                                            // 서버에서 가져온 이미지라면 그대로 사용
                                            if (image.url?.startsWith("http")) return image.url;
                                            // 혹시 상대 경로라면 firebase storage URL로 변환
                                            return `https://firebasestorage.googleapis.com/v0/b/yoonju-blog.firebasestorage.app/o/${encodeURIComponent(image.url ?? "")}?alt=media`;
                                        }}
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
                                        urlFormatter={(image) => {
                                            // 새로 업로드한 이미지라면 미리보기 URL 사용
                                            if (image.file) return image.url;
                                            // 서버에서 가져온 이미지라면 그대로 사용
                                            if (image.url?.startsWith("http")) return image.url;
                                            // 혹시 상대 경로라면 firebase storage URL로 변환
                                            return `https://firebasestorage.googleapis.com/v0/b/yoonju-blog.firebasestorage.app/o/${encodeURIComponent(image.url ?? "")}?alt=media`;
                                        }}
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
        </Form>
    )
}
