import { getProperties } from '@/data/product'
import { ShoppingBagIcon } from 'lucide-react'
import BrandFilter from '@/components/property/brand-filter'
import PropertyCard from '@/components/property/PropertyCard';
import AddToCartButton from '@/components/panier/add-to-cart-button';
import { cookies } from 'next/headers'

interface PropertyPageProps {
    searchParams: Record<string, string | string[] | undefined>
}

export default async function PropertyPage({ searchParams }: PropertyPageProps) {
    const resolvedParams = await searchParams
    const brand = typeof resolvedParams.brand === 'string' ? resolvedParams.brand : null
    const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : null
    const skinType = typeof resolvedParams.skinType === 'string' ? resolvedParams.skinType : null

    const { data: properties } = await getProperties({
        filters: {
            brand,
            category,
            skinType
        },
        pagination: {
            pageSize: 8
        }
    })

    const brands = [...new Set(properties.map(property => property.brand))].filter(Boolean)
    const categories = [...new Set(properties.map(property => property.category))].filter(Boolean)
    const skinTypes = [...new Set(properties.map(property => property.skinType))].filter(Boolean)

    return (
        <div className='text-center'>
            <div className="mb-8 mt-10">
                <BrandFilter
                    brands={brands}
                    categories={categories}
                    skinTypes={skinTypes}
                    selectedBrand={brand}
                    selectedCategory={category}
                    selectedSkinType={skinType}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {properties.map((property) => {
                    return (
                        <PropertyCard
                            property={property}
                            key={property.id}
                            actionButton={
                                <AddToCartButton
                                    key={property.id}
                                    property={property}
                                >
                                    <ShoppingBagIcon />
                                </AddToCartButton>
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
} 