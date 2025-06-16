'use client'
import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


type filterProps = {
    brands: string[]
    categories: string[]
    skinTypes: string[]
    selectedBrand?: string | null
    selectedCategory?: string | null
    selectedSkinType?: string | null
}

export default function PropertyFilter({
    brands,
    selectedBrand,
    categories,
    selectedCategory,
    skinTypes,
    selectedSkinType,
}: filterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === '__ALL__' || value === null) {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/property?${params.toString()}`)
    }

    const updateNumberParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (!value || isNaN(Number(value))) {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/property?${params.toString()}`)
    }


    return (
        <div className="container mx-auto px-4 lg:px-20 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            {/* LEFT: 필터 영역 */}
            <aside className="flex gap-4 items-center justify-center pl-10">
                <p className="text-lg font-semibold">Filters</p>
                <div className="border-r-1 border-gray-300 h-5" />
                {/* Brand */}
                <Select onValueChange={(v) => updateParam('brand', v)} value={selectedBrand || '__ALL__'}>
                    <SelectTrigger className="w-full">
                        <SelectValue>{selectedBrand || 'All Brands'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__ALL__">All Brands</SelectItem>
                        {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Category */}
                <Select onValueChange={(v) => updateParam('category', v)} value={selectedCategory || '__ALL__'}>
                    <SelectTrigger className="w-full">
                        <SelectValue>{selectedCategory || 'All Category'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__ALL__">All Category</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Skin Type */}
                <Select onValueChange={(v) => updateParam('skinType', v)} value={selectedSkinType || '__ALL__'}>
                    <SelectTrigger className="w-full">
                        <SelectValue>{selectedSkinType || 'All Skin Type'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__ALL__">All Skin Type</SelectItem>
                        {skinTypes.map((skin) => (
                            <SelectItem key={skin} value={skin}>{skin}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </aside >
        </div >
    )
} 