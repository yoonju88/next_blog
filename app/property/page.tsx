import { getProperties } from '@/lib/product'
import { ShoppingBagIcon } from 'lucide-react'
import BrandFilter from '@/components/property/brand-filter'
import PropertyCard from '@/components/property/PropertyCard';
import AddToCartButton from '@/components/cart/add-to-cart-button';
import { Suspense } from 'react';

type PropertyPageProps = {
    brand?: string | string[]
    category?: string | string[]
    skinType?: string | string[]
    sale?: string
    sort?: string
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
    const { brand, category: rawCategory, skinType, sale, sort } = await searchParams;
    const category = normalizeCategory(typeof rawCategory === "string" ? rawCategory : null);


    const { data: properties } = await getProperties({
        filters: {
            brand: typeof brand === "string" ? brand : null,
            category,
            skinType: typeof skinType === "string" ? skinType : null
        },
        sort: sort as "newest" | "best",
        pagination: { pageSize: 8 },
    });

    // 🔥 Firebase 상품들을 Prisma에 동기화
    if (properties.length > 0) {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: properties.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.onSale && p.salePrice ? p.salePrice : p.price,
                        images: p.images || [],
                        stock: 50 // Firebase에 재고 필드가 있다면 p.stock 사용
                    }))
                })
            });
        } catch (error) {
            console.error("Failed to sync products:", error);
        }
    }

    const filteredProperties = properties
        .filter(p => !sale || p.onSale) // sale 필터
        .sort((a, b) => (sort === "best" ? (b.soldQuantity || 0) - (a.soldQuantity || 0) : 0));


    const brands = [...new Set(properties.map(property => property.brand))].filter(Boolean)
    const categories = [...new Set(properties.map(property => property.category))].filter(Boolean)
    const skinTypes = [...new Set(properties.map(property => property.skinType))].filter(Boolean)

    let title = "All products";
    if (sale) {
        title = "Products On Sale "
    } else if (sort === "newest") {
        title = "Recently Added Products"
    } else if (sort === "best") {
        title = "Our Best Selling Products"
    }

    return (
        <div className='container w-full'>
            <h1 className="text-center text-foreground/80 py-10 mt-10 text-3xl font-semibold uppercase">
                {title}
            </h1>
            <div className="mb-10 overflow-x-auto max-w-full">
                <Suspense fallback={null}>
                    <BrandFilter
                        brands={brands}
                        categories={categories}
                        skinTypes={skinTypes}
                        selectedBrand={brand as string}
                        selectedCategory={category}
                        selectedSkinType={skinType as string}
                    />
                </Suspense>
            </div>
            <div className="px-4">
                {filteredProperties.length === 0 ? (
                    <h2 className="text-center text-muted-foreground py-10 text-4xl">
                        No products found...
                    </h2>
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