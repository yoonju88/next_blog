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
import { Button } from "../ui/button"

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
    const [open, setOpen] = useState(false)

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

    const FilterContent = () => (
        <div className="flex gap-6 mt-2">
            <div className="flex flex-col">
                <label className="font-semibold text-sm mb-2">Brand</label>
                <Select onValueChange={(v) => updateParam('brand', v)} value={selectedBrand || '__ALL__'}>
                    <SelectTrigger>
                        <SelectValue>{selectedBrand || 'All Brands'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__ALL__">All Brands</SelectItem>
                        {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1">Category</label>
                <Select onValueChange={(v) => updateParam('category', v)} value={selectedCategory || '__ALL__'}>
                    <SelectTrigger>
                        <SelectValue>{selectedCategory || 'All Category'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__ALL__">All Category</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col">
                <label className="font-semibold text-sm mb-1">Skin Type</label>
                <Select onValueChange={(v) => updateParam('skinType', v)} value={selectedSkinType || '__ALL__'}>
                    <SelectTrigger>
                        <SelectValue>{selectedSkinType || 'All Skin Type'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__ALL__">All Skin Type</SelectItem>
                        {skinTypes.map((skin) => (
                            <SelectItem key={skin} value={skin}>{skin}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )

    return (

        <div className="container flex justify-end px-4 lg:px-20">
            {/* 모바일: Dialog */}
            <div className="mb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="lg">Filter</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Filter Products</DialogTitle>
                        </DialogHeader>
                        <FilterContent />
                    </DialogContent>
                </Dialog>
            </div>
        </div>

    )
} 