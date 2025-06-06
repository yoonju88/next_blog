"use client"
import React from 'react'
import { useForm } from "react-hook-form"
import { propertySchema } from '@/validation/propertySchema'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import MultiImageUpload, { ImageUpload } from './multi-image-upload'

type Props = {
    submitButtonLabel: React.ReactNode;
    handleSubmitAction: (data: z.infer<typeof propertySchema>) => void;
    defaultValues?: z.infer<typeof propertySchema>
}

export default function PropertyForm({
    handleSubmitAction,
    submitButtonLabel,
    defaultValues,
}: Props) {
    //defaultValues 객체를 **스프레드 연산자 (...)**로 덮어씌움
    //즉, defaultValues에 값이 있다면 기존 값이 덮어씌워짐 (우선순위: defaultValues > 기본 객체)
    const combinedDefaultValues: z.infer<typeof propertySchema> = {
        ...{
            name: "",
            price: 0,
            subTitle: "",
            costPrice: 0,
            category: "Make Up",
            subCategory: "",
            origin: "",
            manufacturer: "",
            volume: 0,
            description: "",
            status: "Available",
            brand: "",
            images: [],
            ingredients: "",
            keyIngredients: "",
            skinType: "Normal Skin",
            howToUse: "",
            expireDate: "",
            stockQuantity: 0,
            skinBenfit: "",
        },
        ...defaultValues,
    }

    const form = useForm<z.infer<typeof propertySchema>>({
        resolver: zodResolver(propertySchema),
        defaultValues: combinedDefaultValues,
    })
    //console.log("Submit Button Label:", submitButtonLabel);
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitAction)}>
            <div className="grid grid-cols-2 gap-8">
                <fieldset className="flex flex-col gap-4" disabled={form.formState.isSubmitting}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub Title</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price/€</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" value={field.value ?? 0} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost price/€</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" value={field.value ?? 0} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Origin</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="manufacturer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Manufacturer</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Make Up">
                                                    Make Up
                                                </SelectItem>
                                                <SelectItem value="Skin Care">
                                                    Skin Care
                                                </SelectItem>
                                                <SelectItem value="Sun Care">
                                                    Sun Care
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub Category</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="skinType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skin Type</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value='All Skin'>
                                                    All Skin
                                                </SelectItem>
                                                <SelectItem value="Oily Skin">
                                                    Oily Skin
                                                </SelectItem>
                                                <SelectItem value="Dry Skin">
                                                    Dry Skin
                                                </SelectItem>
                                                <SelectItem value="Combination Skin">
                                                    Combination Skin
                                                </SelectItem>
                                                <SelectItem value='Sensitive Skin'>
                                                    Sensitive Skin
                                                </SelectItem>
                                                <SelectItem value='Normal Skin'>
                                                    Normal Skin
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>
                <fieldset className="flex flex-col gap-4" disabled={form.formState.isSubmitting}>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Available">
                                                    Available
                                                </SelectItem>
                                                <SelectItem value="Sold Out">
                                                    Sold Out
                                                </SelectItem>
                                                <SelectItem value="Limited edition">
                                                    Limited edition
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="skinBenefit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skin Benfit</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={10} className='resize-none h-[100px] max-h-[160px] overflow-y-auto' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={10} className='resize-none h-[100px] max-h-[160px] overflow-y-auto' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="volume"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Volume/ml</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" value={field.value ?? 0} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ingredients"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ingredients</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={10} className='resize-none h-[100px] max-h-[160px] overflow-y-auto' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="howToUse"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How to use</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={5} className='resize-none h-[100px] max-h-[160px] overflow-y-auto' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expireDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of expiration</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stockQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>
            </div>
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
                                urlFormatter={(image) => {
                                    // 새로 업로드한 이미지라면 미리보기 URL 사용
                                    if (image.file) return image.url;
                                    // 서버에서 가져온 이미지라면 그대로 사용
                                    if (image.url?.startsWith("http")) return image.url;
                                    // 혹시 상대 경로라면 firebase storage URL로 변환
                                    return `https://firebasestorage.googleapis.com/v0/b/yoonju-blog.firebasestorage.app/o/${encodeURIComponent(image.url ?? "")}?alt=media`;
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button
                type="submit"
                className="max-w-md mx-auto mt-4 w-full flex gap-2"
                disabled={form.formState.isSubmitting}
            >
                {submitButtonLabel}
            </Button>
        </form>
    </Form >
}
