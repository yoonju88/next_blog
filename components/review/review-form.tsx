"use client"
import { useState } from 'react';
import React from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import MultiImageUpload from '@/components/multi-image-upload'
import { reviewSchema } from '@/validation/reviewSchema'
import { Star } from 'lucide-react';
import { Input } from '../ui/input';
import Image from 'next/image';
import { ImageUpload } from '@/types/image';
import imageDisplayUrlFormatter from '@/lib/imageDisplayUrlFormatter';

type Props = {
    handleSubmitAction: (data: z.infer<typeof reviewSchema>) => void;
    defaultValues?: z.infer<typeof reviewSchema>
    userName: string;
    userPhotoURL: string;
}

export default function ReviewForm({
    handleSubmitAction,
    defaultValues,
    userName,
    userPhotoURL,
}: Props) {
    const [hovered, setHovered] = useState(0)
    const [rating, setRating] = useState(0)
    const combinedDefaultValues: z.infer<typeof reviewSchema> = {
        rating: 0,
        comment: "",
        images: [],
        userName,
        userPhotoURL,
        ...defaultValues,
    }


    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: combinedDefaultValues,
    })
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitAction)}>
            <fieldset
                className="flex flex-col gap-4 my-4 "
                disabled={form.formState.isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="userPhotoURL"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex flex-col justify-center items-center">
                                    {userPhotoURL ? (
                                        <Image src={userPhotoURL} alt="User photo" width={96}      // Tailwind w-24 → 96px
                                            height={96} className="w-24 h-24 rounded-full mb-2 object-cover" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-300 mb-2 flex items-center justify-center text-gray-600">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User Name</FormLabel>
                            <FormControl>
                                <Input
                                    value={userName}
                                    readOnly
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                                <span className='flex gap-1'>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            onMouseEnter={() => setHovered(i)}
                                            onMouseLeave={() => setHovered(0)}
                                            onClick={() => {
                                                setRating(i)
                                                form.setValue("rating", i)
                                            }}
                                            className={`w-8 h-8 ${i <= (hovered || rating) ? "fill-amber-300 stroke-amber-300" : "stroke-gray-400"}`}
                                        />
                                    ))}
                                </span>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder='Please fill comment here.'
                                    className='resize-none h-[100px] max-h-[160px] overflow-y-auto mt-4'

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <MultiImageUpload
                                    onImagesChangeAction={(images: ImageUpload[]) => {
                                        form.setValue("images", images)
                                    }}
                                    images={field.value}
                                    urlFormatterAction={imageDisplayUrlFormatter}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </fieldset>

            <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
            >
                Save Review
            </Button>
        </form>
    </Form>
}

