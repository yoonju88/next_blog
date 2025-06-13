'use client'

import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = {
    brands: string[]
    selectedBrand?: string
}

export default function BrandFilter({ brands, selectedBrand }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleBrandChange = (brand: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (brand) {
            params.set('brand', brand)
        } else {
            params.delete('brand')
        }
        router.push(`/property?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap gap-2 justify-center">
            <Button
                variant="link"
                onClick={() => handleBrandChange("")}
                className={cn(
                    "rounded-sm",
                    !selectedBrand && "text-primary font-medium"
                )}
            >
                All Brands
            </Button>
            {brands.map(brand => (
                <Button
                    key={brand}
                    variant='link'
                    onClick={() => handleBrandChange(brand)}
                    className={cn(
                        "rounded-sm",
                        selectedBrand === brand && "text-primary font-medium"
                    )}
                >
                    {brand}
                </Button>
            ))}
        </div>
    )
} 