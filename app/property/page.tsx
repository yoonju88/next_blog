import { getProperties } from '@/data/product'
import { ShoppingBagIcon } from 'lucide-react'
import imageUrlFormatter from '@/lib/imageUrlFormatter';
import BrandFilter from '@/components/property/brand-filter'
import PropertyCard from '@/components/property/PropertyCard';
import AddToCartButton from '@/components/property/add-to-cart-button';

export default async function PropertyPage({
    searchParams
}: {
    searchParams?: { brand?: string }
}) {
    const { data: properties } = await getProperties({
        filters: {
            brand: searchParams?.brand || null
        },
        pagination: {
            pageSize: 100
        }
    })

    const brands = [...new Set(properties.map(property => property.brand))].filter(Boolean)

    return (
        <div className='text-center'>
            <div className="mb-8">
                <BrandFilter brands={brands} selectedBrand={searchParams?.brand} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((property) => {
                    const mainImage = Array.isArray(property.images) && property.images.length > 0
                        ? imageUrlFormatter(property.images[0])
                        : '/fallback.jpg';

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