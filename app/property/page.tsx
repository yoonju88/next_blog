import { getProperties } from '@/data/product'
import { ShoppingBagIcon } from 'lucide-react'
import BrandFilter from '@/components/property/brand-filter'
import PropertyCard from '@/components/property/PropertyCard';
import AddToCartButton from '@/components/panier/add-to-cart-button';
import { cookies } from 'next/headers'

type PropertyPageProps = {
    brand?: string | string[]
    category?: string | string[]
    skinType?: string | string[]
    sale?: string
    sort?: string
}
function serializeTimestamps(obj: any) {
    if (Array.isArray(obj)) {
        return obj.map(serializeTimestamps);
    } else if (obj && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            const value = obj[key];
            if (value?.toDate instanceof Function) {
                newObj[key] = value.toDate().toISOString();
            } else if (value?._seconds) {
                newObj[key] = new Date(value._seconds * 1000).toISOString();
            } else {
                newObj[key] = serializeTimestamps(value);
            }
        }
        return newObj;
    } else {
        return obj;
    }
}

function normalizeCategory(input: string | null): "Skin Care" | "Make Up" | "Sun Care" | null {
    switch (input?.toLowerCase()) {
        case "skincare":
            return "Skin Care";
        case "makeup":
            return "Make Up";
        case "suncare":
            return "Sun Care";
        default:
            return null;
    }
}

export default async function PropertyPage({ searchParams }: { searchParams: Promise<PropertyPageProps> }) {
    const resolvedParams = await searchParams
    const brand = typeof resolvedParams.brand === 'string' ? resolvedParams.brand : null
    const categoryParam = typeof resolvedParams.category === 'string' ? resolvedParams.category : null
    const skinType = typeof resolvedParams.skinType === 'string' ? resolvedParams.skinType : null
    const sale = resolvedParams.sale === 'true'
    const sort = resolvedParams.sort === 'best'
    const category = normalizeCategory(categoryParam)

    const { data: rawProperties } = await getProperties({
        filters: {
            brand,
            category,
            skinType
        },
        pagination: {
            pageSize: 8
        }
    })
    const properties = rawProperties.map(p => serializeTimestamps(p));

    const brands = [...new Set(properties.map(property => property.brand))].filter(Boolean)
    const categories = [...new Set(properties.map(property => property.category))].filter(Boolean)
    const skinTypes = [...new Set(properties.map(property => property.skinType))].filter(Boolean)

    let filteredProperties = properties
    if (sale) {
        filteredProperties = filteredProperties.filter((property) => property.onSale)
    }
    if (sort) {
        filteredProperties = [...filteredProperties].sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
    }

    return (
        <div className='container w-full'>
            <div className="mb-10 mt-10 overflow-x-auto max-w-full">
                <BrandFilter
                    brands={brands}
                    categories={categories}
                    skinTypes={skinTypes}
                    selectedBrand={brand}
                    selectedCategory={category}
                    selectedSkinType={skinType}
                />
            </div>
            <div className="px-4">
                {filteredProperties.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        The Product
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {filteredProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                actionButton={
                                    <AddToCartButton property={property} key={property.id}>
                                        <ShoppingBagIcon />
                                    </AddToCartButton>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 